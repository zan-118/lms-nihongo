"use client";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LessonDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();

  // State Management
  const [lesson, setLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Ambil Data Materi
        const { data: lessonData, error: lError } = await supabase
          .from("lessons")
          .select("*")
          .eq("id", params.id)
          .single();

        if (lError) throw lError;
        setLesson(lessonData);

        // 2. Ambil Soal Latihan yang terhubung ke lesson_id ini
        const { data: quesData, error: qError } = await supabase
          .from("questions")
          .select("*")
          .eq("lesson_id", params.id)
          .eq("is_tryout", false);

        if (qError) throw qError;
        setQuestions(quesData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchData();
  }, [params.id]);

  const handleAnswer = (selectedIndex) => {
    const correctIdx = parseInt(questions[currentIdx].correct_answer);
    if (selectedIndex === correctIdx) setScore((prev) => prev + 1);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!lesson)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="font-black text-slate-300 mb-4">MATERI TIDAK DITEMUKAN</p>
        <Link href="/materi" className="text-blue-600 font-bold underline">
          Kembali
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans pb-20">
      {/* STICKY PROGRESS HEADER */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="text-slate-400 hover:text-slate-900 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="text-center">
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-600 leading-none mb-1">
              Learning Module
            </p>
            <h2 className="text-xs font-black uppercase tracking-tighter truncate max-w-[150px]">
              {lesson.title}
            </h2>
          </div>
          <div className="w-6"></div> {/* Spacer */}
        </div>
      </nav>

      <main className="max-w-2xl mx-auto p-6 md:p-10">
        {!showQuiz ? (
          /* ================= TAMPILAN MATERI ================= */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
              <span className="inline-block bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                Level {lesson.level}
              </span>
              <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter leading-[0.9] mb-6">
                {lesson.title}.
              </h1>
            </div>

            {/* BOX KONTEN MATERI UTAMA */}
            <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 mb-10 border border-slate-100">
              <div className="prose prose-slate max-w-none">
                <p className="text-lg md:text-xl leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">
                  {lesson.content}
                </p>
              </div>
            </div>

            {/* TOMBOL START QUIZ */}
            <div className="bg-slate-900 text-white p-10 rounded-[3rem] text-center shadow-2xl shadow-blue-200">
              <h3 className="text-2xl font-black italic mb-2 tracking-tighter">
                Siap Tes Kemampuan?
              </h3>
              <p className="text-slate-400 text-xs mb-8 font-bold uppercase tracking-widest">
                Terdapat {questions.length} soal latihan
              </p>
              <button
                onClick={() => setShowQuiz(true)}
                className="w-full bg-blue-600 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-blue-600 transition-all active:scale-95"
              >
                Mulai Kuis Bab →
              </button>
            </div>
          </div>
        ) : !quizFinished ? (
          /* ================= TAMPILAN QUIZ ================= */
          <div className="animate-in zoom-in-95 duration-300">
            <div className="w-full h-1 bg-slate-100 rounded-full mb-10">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${((currentIdx + 1) / questions.length) * 100}%`,
                }}
              ></div>
            </div>

            <div className="mb-10">
              <p className="text-[10px] font-black text-blue-600 uppercase mb-2">
                Soal {currentIdx + 1} / {questions.length}
              </p>
              <h2 className="text-3xl font-bold tracking-tight leading-tight italic">
                {questions[currentIdx]?.question_text}
              </h2>
            </div>

            <div className="grid gap-3">
              {(() => {
                // Logika pengamanan parsing
                const currentOptions = questions[currentIdx]?.options;
                const optionsArray =
                  typeof currentOptions === "string"
                    ? JSON.parse(currentOptions || "[]")
                    : currentOptions || [];

                return optionsArray.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full text-left p-6 border-2 border-slate-50 bg-slate-50 rounded-2xl font-bold hover:border-blue-600 hover:bg-white transition-all flex items-center gap-4 group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                ));
              })()}
            </div>
          </div>
        ) : (
          /* ================= TAMPILAN HASIL ================= */
          <div className="text-center animate-in fade-in zoom-in duration-500 py-10">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
              🎉
            </div>
            <h2 className="text-4xl font-black italic tracking-tighter mb-2">
              Otsukaresama!
            </h2>
            <p className="text-slate-400 font-bold text-sm mb-10 uppercase tracking-widest">
              Kamu menyelesaikan bab ini
            </p>

            <div className="bg-[#F8FAFC] p-8 rounded-[2.5rem] border border-slate-100 mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                Skor Akhir
              </p>
              <p className="text-5xl font-black text-blue-600 italic">
                {Math.round((score / questions.length) * 100)}%
              </p>
              <p className="text-xs font-bold text-slate-400 mt-2">
                {score} dari {questions.length} Benar
              </p>
            </div>

            <button
              onClick={() => router.push("/materi")}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-blue-600 transition-all"
            >
              LANJUT KE MATERI LAIN
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
