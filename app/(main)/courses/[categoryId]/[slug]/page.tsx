/**
 * @file page.tsx
 * @description Halaman ruang kelas dinamis untuk materi pembelajaran tunggal.
 * Menangani Portable Text, Kuis, Audio, dan modul SRS.
 * @module LessonPage
 */

// ======================
// IMPORTS
// ======================
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/lib/sanity.fetch";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  BookOpen,
  Headphones,
  Award,
  Zap,
  PlayCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import QuizEngine from "@/components/features/exams/quiz-engine/QuizEngine";
import TTSReader from "@/components/features/tools/tts/TTSReader";
import AddToSRSButton from "@/components/features/srs/actions/AddToSRSButton";
import DownloadPdfButton from "@/components/features/pdf/actions/DownloadPdfButton";

import { renderSmartText } from "@/components/features/global/SmartText";
import { sharedPtComponents } from "@/components/ui/portable-text/SharedPortableText";
import * as wanakana from "wanakana";
import { splitFurigana } from "@/components/ui/SmartJapanese";

// ======================
// CONFIG / CONSTANTS
// ======================

interface Props {
  params: Promise<{ categoryId: string; slug: string }>;
}

// ======================
// DATABASE OPERATIONS
// ======================

/**
 * Menarik data materi lengkap dari Sanity CMS.
 */
async function getLessonData(categoryId: string, slug: string) {
  const query = `{
    "lesson": *[_type == "lesson" && course_category->slug.current == $categoryId && slug.current == $slug][0] {
      _id, title, summary, 
      "levelCode": course_category->slug.current, 
      "levelTitle": course_category->title,
      "categoryType": course_category->type,
      vocabList[]-> { 
        _id, _type,
        _type == "vocab" => { word, furigana, romaji, meaning, hinshi },
        _type == "verb_dictionary" => { "word": jisho, furigana, romaji, meaning, transitivity },
        _type == "kanji" => { "word": character, meaning, onyomi, kunyomi }
      },
      kanjiList[]-> {
        _id, character, meaning, onyomi, kunyomi, jlptLevel, strokeOrderSvg
      },
      grammarList[]-> {
        _id, title, meaning, formation, "slug": slug.current, jlptLevel,
        exampleSentences[] {
          jp, furigana, romaji, id
        }
      },
      listeningList[]-> {
        _id, title, "audioUrl": audioFile.asset->url,
        transcript[] {
          speaker, text, furigana, romaji, translation, startTime, endTime
        }
      },
      readingList[]-> {
        _id, title, difficulty, body, translation, "audioUrl": audioFile.asset->url
      },
      cheatsheets[]-> {
        _id, title, category,
        items[] { label, jp, furigana, romaji },
        linkedVocab[]-> { _id, word, furigana, romaji, meaning }
      },
      finalPractice-> {
        _id, title, "slug": slug.current
      },
      articles[] {
        ...,
        _type == "image" => {
          ...,
          asset-> {
            _id,
            metadata {
              lqip,
              dimensions
            }
          }
        }
      },
      quizzes, seoTitle, seoDescription, grammar,
    },
    "nav": *[_type == "lesson" && course_category->slug.current == $categoryId] | order(orderNumber asc, _createdAt desc) {
      "slug": slug.current, title
    }
  }`;
  return await sanityFetch<any>({
    query,
    params: { categoryId, slug },
    tags: ["lesson", "course_category", "vocab", "verb_dictionary", "kanji"],
  });
}

// ======================
// METADATA
// ======================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoryId, slug } = await params;
  const data = await getLessonData(categoryId, slug);
  const lesson = data?.lesson;
  if (!lesson) return { title: "Pelajaran Tidak Ditemukan | NihongoRoute" };
  return {
    title: lesson.seoTitle ?? `${lesson.title} | NihongoRoute`,
    description: lesson.seoDescription ?? lesson.summary,
  };
}

// ======================
// HELPERS / COMPONENTS
// ======================



export default async function LessonPage({ params }: Props) {
  const { categoryId, slug } = await params;
  const data = await getLessonData(categoryId, slug);
  const lesson = data?.lesson;
  const nav = data?.nav || [];

  if (!lesson) return notFound();

  const currentIndex = nav.findIndex((l: { slug: string }) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? nav[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < nav.length - 1
      ? nav[currentIndex + 1]
      : null;
  const isSideQuest = lesson.categoryType === "general";

  const formattedQuizzes =
    lesson.quizzes
      ?.map((quiz: { question: string; options: { text: string; isCorrect?: boolean }[]; explanation?: string }) => {
        if (!quiz) return null;
        const correctOption = quiz.options?.find((opt: { isCorrect?: boolean }) => opt?.isCorrect);
        return {
          question: quiz.question || "",
          options: quiz.options?.map((opt: { text: string }) => opt?.text || "") || [],
          answer: correctOption ? correctOption.text : "",
          explanation: quiz.explanation || "",
        };
      })
      .filter(Boolean) || [];

  return (
    <div className="w-full text-foreground px-4 md:px-8 relative overflow-hidden flex flex-col flex-1 transition-colors duration-300">
      {/* Background Ambient Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <article className="max-w-4xl mx-auto w-full relative z-10 flex-1">


        <header className="mb-20">
          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-8 ${isSideQuest ? "text-warning" : "text-foreground"}`}
          >
            {lesson.title}
          </h1>
          {lesson.summary && (
            <div
              className={`p-8 rounded-[2rem] neo-inset border-l-8 mb-8 ${isSideQuest ? "border-warning" : "border-primary"}`}
            >
               <p className="text-base md:text-lg font-medium leading-relaxed text-muted-foreground">
                 {renderSmartText(lesson.summary)}
               </p>
            </div>
          )}
          <div className="flex justify-start">
             <DownloadPdfButton data={lesson} />
          </div>
        </header>

        <div className="space-y-24 mb-24">
          {lesson.vocabList && lesson.vocabList.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
                  <span className="text-2xl">統</span> Target
                  Kosakata
                </h2>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lesson.vocabList.map((v: { _id: string; word: string; furigana?: string; romaji?: string; meaning: string; hinshi?: string; onyomi?: string; kunyomi?: string; transitivity?: string }) => {
                  if (!v) return null;
                  return (
                    <div
                      key={v._id || Math.random()}
                      className="neo-card p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group hover:border-primary/30 transition-colors duration-300"
                    >
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] font-bold text-primary text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
                            {v.romaji || (v.furigana ? wanakana.toRomaji(v.furigana) : "-")}
                          </span>
                          {v.hinshi && (
                            <span className="text-[9px] font-mono font-black text-secondary uppercase tracking-widest bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded">
                              {v.hinshi === "Meishi" ? "Kata Benda" :
                               v.hinshi === "Doushi" ? "Kata Kerja" :
                               v.hinshi === "I-Keiyoushi" ? "Kata Sifat-I" :
                               v.hinshi === "Na-Keiyoushi" ? "Kata Sifat-Na" :
                               v.hinshi === "Fukushi" ? "Kata Keterangan" :
                               v.hinshi === "Joshi" ? "Partikel" :
                               v.hinshi === "Kandoushi" ? "Kata Seru" :
                               v.hinshi === "Rentaishi" ? "Kata Penunjuk" : v.hinshi}
                            </span>
                          )}
                          {v.transitivity && (
                            <span className={`text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                              v.transitivity === "transitive" 
                                ? "text-warning text-warning bg-warning/10 border-warning/20" 
                                : "text-primary text-primary bg-primary/10 border-primary/20"
                            }`}>
                              {v.transitivity === "transitive" ? "Transitif" : "Intransitif"}
                            </span>
                          )}
                        </div>
                        <h4 className="group-hover:text-primary dark:group-hover:text-primary transition-colors tracking-tight mb-2">
                           <div className="text-3xl font-black text-foreground">
                              {splitFurigana(v.word || "", v.furigana || "").map((chunk, i) => (
                                chunk.furi ? (
                                  <ruby key={i}>
                                    {chunk.text}
                                    <rt className="text-primary/80 font-bold tracking-widest not-italic" style={{ fontSize: '0.55em' }}>
                                      {chunk.furi}
                                    </rt>
                                  </ruby>
                                ) : (
                                  <span key={i}>{chunk.text}</span>
                                )
                              ))}
                           </div>
                        </h4>
                        
                        {(v.onyomi || v.kunyomi) && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {v.onyomi && (
                              <span className="text-[10px] font-bold text-secondary border border-secondary/20 px-2 py-0.5 rounded-lg bg-secondary/5">
                                ON: {v.onyomi}
                              </span>
                            )}
                            {v.kunyomi && (
                              <span className="text-[10px] font-bold text-success text-success border border-success/20 px-2 py-0.5 rounded-lg bg-success/5">
                                KUN: {v.kunyomi}
                              </span>
                            )}
                          </div>
                        )}

                        <p className="text-[13px] md:text-sm text-muted-foreground font-medium leading-relaxed">
                          {v.meaning || "-"}
                        </p>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-3 shrink-0 w-full sm:w-auto justify-end">
                        {v._id && <AddToSRSButton wordId={v._id} />}
                        {v.word && <TTSReader text={v.word} minimal={true} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {lesson.kanjiList && lesson.kanjiList.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
                  <span className="text-2xl">漢字</span> Target Kanji
                </h2>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {lesson.kanjiList.map((k: any) => (
                  <Link
                    key={k._id}
                    href={`/library/kanji/${k.character}`}
                    className="neo-card p-6 flex flex-col items-center justify-center group hover:border-primary/40 transition-all duration-300"
                  >
                    <span className="text-4xl font-black mb-3 group-hover:scale-110 transition-transform">
                      {k.character}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">
                      {k.meaning}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {lesson.articles && lesson.articles.length > 0 && (
            <section className="prose-custom">
              <PortableText value={lesson.articles} components={sharedPtComponents} />
            </section>
          )}

          {( (lesson.grammarList && lesson.grammarList.length > 0) || (lesson.grammar && lesson.grammar.length > 0) ) && (
            <section id="grammar">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-foreground flex items-center gap-3">
                  <span className="text-2xl not-italic">文法</span> Tata Bahasa (Grammar)
                </h2>
                <div className="h-[1px] flex-1 bg-border" />
              </div>

              {/* Inline Grammar (Legacy/Short) */}
              {lesson.grammar && (
                <div className="prose-custom mb-12 bg-secondary/5 p-8 rounded-[2rem] border border-border/50">
                  <PortableText value={lesson.grammar} components={sharedPtComponents} />
                </div>
              )}

              {lesson.grammarList && lesson.grammarList.length > 0 && (
                <div className="space-y-12">
                  {lesson.grammarList.map((g: any) => (
                    <div key={g._id} className="neo-card p-8 md:p-12 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                        <FileText size={120} />
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                            {g.jlptLevel || "N/A"}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">{g.title}</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                          <div className="space-y-8">
                            <div>
                              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Arti / Penggunaan</h4>
                              <p className="text-lg font-medium text-foreground leading-relaxed">
                                {g.meaning}
                              </p>
                            </div>
                            {g.formation && (
                              <div>
                                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3">Pembentukan (Setsuzoku)</h4>
                                <div className="p-4 rounded-2xl neo-inset bg-primary/5 font-japanese text-lg border-l-4 border-primary">
                                  {g.formation}
                                </div>
                              </div>
                            )}
                          </div>

                          {g.exampleSentences && g.exampleSentences.length > 0 && (
                            <div>
                              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Contoh Kalimat</h4>
                              <div className="space-y-4">
                                {g.exampleSentences.map((ex: any, idx: number) => (
                                  <div key={idx} className="p-4 rounded-2xl bg-secondary/5 border border-border/50 group/ex hover:border-secondary/30 transition-all">
                                    <p className="text-base font-bold text-foreground mb-1">
                                      {renderSmartText(ex.jp)}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground font-medium italic">{ex.id}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-10 flex justify-end">
                          <Link 
                            href={`/library/grammar/${g.slug}`}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-3 transition-all"
                          >
                            Lihat Detail <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {lesson.listeningList && lesson.listeningList.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
                  <Headphones size={24} className="text-secondary" /> Latihan Mendengar
                </h2>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
              <div className="space-y-10">
                {lesson.listeningList.map((l: any) => (
                  <div key={l._id} className="neo-card p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-border pb-8">
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tight mb-2">{l.title}</h3>
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                           <Clock size={12} /> Klik ikon play untuk mendengar percakapan
                        </p>
                      </div>
                      {l.audioUrl && (
                        <audio controls className="w-full md:w-64 h-10 filter brightness-90 contrast-125">
                          <source src={l.audioUrl} type="audio/mpeg" />
                          Browser anda tidak mendukung pemutar audio.
                        </audio>
                      )}
                    </div>
                    
                    {l.transcript && (
                      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                        {l.transcript.map((item: any, idx: number) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">{item.speaker}</span>
                            <div className="p-4 rounded-2xl bg-secondary/5 border border-secondary/10 group/line hover:bg-secondary/10 transition-all">
                               <div className="text-lg font-japanese font-bold text-foreground mb-1 leading-relaxed">
                                 {Array.isArray(item.text) ? (
                                   <PortableText value={item.text} components={sharedPtComponents} />
                                 ) : (
                                   <span>{item.text || item.furigana}</span>
                                 )}
                               </div>
                               <p className="text-xs text-muted-foreground font-medium italic">{item.translation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {lesson.readingList && lesson.readingList.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
                  <BookOpen size={24} className="text-primary" /> Bahan Bacaan
                </h2>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
              <div className="space-y-16">
                {lesson.readingList.map((r: any) => (
                  <div key={r._id} className="relative">
                    <div className="flex items-center justify-between mb-8">
                       <div>
                         <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1 rounded-full mb-3 inline-block">
                           {r.difficulty} Reading
                         </span>
                         <h3 className="text-3xl font-black tracking-tighter uppercase">{r.title}</h3>
                       </div>
                       {r.audioUrl && (
                         <button className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:scale-110 hover:bg-primary/20 transition-all shadow-glow">
                           <PlayCircle size={32} />
                         </button>
                       )}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="prose-custom text-xl leading-[2.2] font-japanese bg-card/30 p-8 rounded-[2.5rem] border border-border/50">
                        <PortableText value={r.body} components={sharedPtComponents} />
                      </div>
                      <div className="prose-custom opacity-70 italic text-base bg-muted/20 p-8 rounded-[2.5rem] border border-border/30">
                        <h4 className="text-[10px] not-italic font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Terjemahan</h4>
                        <PortableText value={r.translation} components={sharedPtComponents} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {lesson.cheatsheets && lesson.cheatsheets.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
                  <Zap size={24} className="text-warning fill-warning/20" /> Referensi Cepat
                </h2>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
              <div className="space-y-12">
                {lesson.cheatsheets.map((c: any) => (
                  <div key={c._id} className="neo-card overflow-hidden">
                    <div className="bg-warning/5 p-6 border-b border-warning/10">
                       <p className="text-[10px] font-black text-warning uppercase tracking-widest mb-1">{c.category}</p>
                       <h3 className="text-xl font-black uppercase tracking-tight">{c.title}</h3>
                    </div>
                    <div className="p-8">
                      {c.items && c.items.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                          {c.items.map((item: any, idx: number) => (
                            <div key={idx} className="p-5 rounded-2xl neo-inset hover:bg-warning/5 transition-all flex flex-col items-center text-center">
                              <span className="text-2xl font-japanese font-black mb-1">{item.jp}</span>
                              <span className="text-[10px] font-bold text-warning/80 uppercase tracking-widest mb-2">{item.romaji}</span>
                              <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {c.linkedVocab && c.linkedVocab.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 text-center">Kosakata Terkait</h4>
                          <div className="flex flex-wrap justify-center gap-3">
                            {c.linkedVocab.map((v: any) => (
                              <div key={v._id} className="px-4 py-2 rounded-xl bg-card border border-border text-sm font-bold flex items-center gap-2">
                                <span className="text-primary">{v.word}</span>
                                <span className="text-[10px] text-muted-foreground font-medium">({v.meaning})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {lesson.finalPractice && (
            <section>
              <div className="neo-card p-10 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12">
                  <Award size={180} />
                </div>
                <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                    <Award size={32} />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4">
                    Siap untuk Ujian Akhir?
                  </h3>
                  <p className="text-muted-foreground mb-8 text-sm md:text-base font-medium">
                    Uji pemahaman kamu tentang materi <strong>{lesson.title}</strong> dengan simulasi ujian komprehensif.
                  </p>
                  <Link
                    href={`/exams/${lesson.finalPractice.slug}`}
                    className="px-10 py-4 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
                  >
                    Mulai Latihan: {lesson.finalPractice.title}
                  </Link>
                </div>
              </div>
            </section>
          )}

          {formattedQuizzes.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
                  <span className="text-2xl">笞｡</span> Uji Pemahaman
                </h2>
                <div className="h-[1px] flex-1 bg-border" />
              </div>
              <QuizEngine questions={formattedQuizzes} lessonId={lesson._id} />
            </section>
          )}
        </div>

        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-12 border-t border-border mt-auto mb-20">
          {prevLesson ? (
            <Link
              href={`/courses/${lesson.levelCode || categoryId}/${prevLesson.slug}`}
              className="neo-card h-full p-8 group flex flex-col justify-center items-start hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
            >
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary dark:group-hover:text-primary mb-3 flex items-center gap-2 transition-colors">
                <ChevronLeft size={14} aria-hidden="true" /> Materi Sebelumnya
              </span>
              <h4 className="text-xl font-black uppercase text-foreground tracking-tight leading-tight">
                {prevLesson.title}
              </h4>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
          {nextLesson ? (
            <Link
              href={`/courses/${lesson.levelCode || categoryId}/${nextLesson.slug}`}
              className="neo-card h-full p-8 group flex flex-col justify-center items-end text-right hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary dark:group-hover:text-primary mb-3 flex items-center gap-2 transition-colors">
                Materi Selanjutnya <ChevronRight size={14} aria-hidden="true" />
              </span>
              <h4 className="text-xl font-black italic uppercase text-foreground tracking-tight leading-tight">
                {nextLesson.title}
              </h4>
            </Link>
          ) : (
            <Link
              href={`/courses/${lesson.levelCode || categoryId}`}
              className="neo-card h-full p-8 flex flex-col items-center justify-center text-center bg-primary/5 border-primary/20 group hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                脂
              </span>
              <p className="text-xs font-black uppercase tracking-widest text-primary text-primary">
                Yeay! Materi Selesai
              </p>
            </Link>
          )}
        </nav>
      </article>
    </div>
  );
}
