"use client";

import { useState, useEffect, useCallback, use, useRef } from "react";
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function TryoutPage({ params }) {
  const resolvedParams = use(params);
  const packageId = resolvedParams.packageId;
  const router = useRouter();
  const audioRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [packageName, setPackageName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobNavOpen, setIsMobNavOpen] = useState(false);

  const [result, setResult] = useState({
    score: 0,
    isPassed: false,
    correctTotal: 0,
    sections: {
      languageKnowledge: { correct: 0, total: 0 },
      reading: { correct: 0, total: 0 },
      listening: { correct: 0, total: 0 },
    },
  });

  // --- 1. DATA FETCHING ---
  const fetchTryout = useCallback(async () => {
    try {
      const query = `*[_type == "quizPackage" && slug.current == $slug][0]{
        packageName,
        timeLimit,
        "questions": *[_type == "question" && references(^._id)] | order(order asc) {
          questionText, 
          options, 
          correctAnswer,
          category,
          "image": image.asset->url,
          "audio": audio.asset->url
        }
      }`;
      const data = await client.fetch(query, { slug: packageId });
      if (data) {
        setPackageName(data.packageName);
        setQuestions(data.questions || []);
        setTimeLeft(data.timeLimit * 60);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [packageId]);

  useEffect(() => {
    fetchTryout();
  }, [fetchTryout]);

  // --- 2. TIMER LOGIC ---
  useEffect(() => {
    if (loading || isFinished || timeLeft <= 0) {
      if (timeLeft === 0 && !loading && !isFinished) handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished, loading]);

  const handleFinish = () => {
    let secData = {
      languageKnowledge: { correct: 0, total: 0 },
      reading: { correct: 0, total: 0 },
      listening: { correct: 0, total: 0 },
    };

    questions.forEach((q, index) => {
      const cat = q.category || "languageKnowledge";
      if (!secData[cat]) secData[cat] = { correct: 0, total: 0 };
      secData[cat].total++;
      if (userAnswers[index] === q.correctAnswer) {
        secData[cat].correct++;
      }
    });

    const correctTotal = Object.values(secData).reduce(
      (acc, curr) => acc + curr.correct,
      0,
    );
    const finalScore = Math.round(
      (correctTotal / (questions.length || 1)) * 100,
    );
    const passed = finalScore >= 60;

    setResult({
      score: finalScore,
      isPassed: passed,
      correctTotal,
      sections: secData,
    });
    setIsFinished(true);

    if (passed) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0ef", "#ffffff", "#1f242d"],
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const renderSidebarContent = () => {
    const categories = [
      { id: "languageKnowledge", label: "文字・語彙 / 文法" },
      { id: "reading", label: "読解" },
      { id: "listening", label: "聴解" },
    ];

    return (
      <div className="space-y-6">
        {categories.map((cat) => {
          const catQuestions = questions.filter((q) => q.category === cat.id);
          if (catQuestions.length === 0) return null;

          return (
            <div key={cat.id}>
              <h3 className="text-[9px] font-black text-[#0ef]/60 mb-3 uppercase tracking-widest flex items-center gap-2">
                {cat.label}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, idx) => {
                  if (q.category !== cat.id) return null;
                  const isCurrent = currentIndex === idx;
                  const isAnswered = userAnswers[idx] !== undefined;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsMobNavOpen(false);
                      }}
                      className={`h-9 rounded-lg text-[10px] font-bold transition-all border shadow-sm
                        ${
                          isCurrent
                            ? "bg-[#0ef] border-[#0ef] text-[#1f242d] shadow-[0_0_10px_rgba(0,255,239,0.3)]"
                            : isAnswered
                              ? "bg-[#1e2024] border-[#0ef]/40 text-white"
                              : "bg-[#1f242d] border-white/5 text-[#c4cfde]/20 hover:border-white/10"
                        }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#1f242d] flex items-center justify-center">
        <p className="text-[#0ef] font-black animate-pulse tracking-[0.5em] text-[10px]">
          SYNCING_EXAM_DATA...
        </p>
      </div>
    );

  // --- RESULT VIEW ---
  if (isFinished && !isReviewMode) {
    return (
      <div className="min-h-screen bg-[#1f242d] text-[#c4cfde] p-6 flex flex-col items-center py-20 font-bodyFont selection:bg-[#0ef] selection:text-[#1f242d]">
        <div className="max-w-2xl w-full bg-[#1e2024] rounded-[3rem] border border-white/5 overflow-hidden shadow-shadowOne">
          <div
            className={`p-12 text-center ${result.isPassed ? "bg-gradient-to-r from-teal-500 to-[#0ef]" : "bg-gradient-to-r from-red-600 to-red-900"} text-[#1f242d]`}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 opacity-60">
              Official Report
            </p>
            <h1 className="text-5xl font-black italic tracking-tighter font-titleFont">
              {result.isPassed ? "合格 / PASSED" : "不合格 / FAILED"}
            </h1>
          </div>
          <div className="p-10 md:p-14">
            <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-10">
              <div>
                <p className="text-[10px] font-black text-[#c4cfde]/30 uppercase tracking-widest">
                  Aptitude Score
                </p>
                <p className="text-9xl font-black text-white italic tracking-tighter leading-none font-titleFont">
                  {result.score}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`text-4xl mb-2 ${result.isPassed ? "text-[#0ef]" : "text-red-500"}`}
                >
                  {result.isPassed ? "💠" : "⚠️"}
                </div>
              </div>
            </div>
            <div className="space-y-8 mb-16">
              {Object.entries(result.sections).map(([key, data]) => (
                <div key={key}>
                  <div className="flex justify-between text-[10px] font-black mb-3 uppercase tracking-widest">
                    <span className="text-[#c4cfde]/50">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-[#0ef]">
                      {Math.round((data.correct / (data.total || 1)) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${result.isPassed ? "bg-[#0ef]" : "bg-red-500"}`}
                      style={{
                        width: `${(data.correct / (data.total || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => {
                  setIsReviewMode(true);
                  setCurrentIndex(0);
                }}
                className="bg-[#0ef] text-[#1f242d] py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-shadowOne"
              >
                Review System Discussion
              </button>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#1e2024] border border-white/10 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 shadow-shadowOne"
                >
                  Retake Exam
                </button>
                <Link
                  href="/dashboard"
                  className="bg-white text-black py-5 rounded-2xl text-center flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-[#0ef] transition-all"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- EXAM VIEW ---
  return (
    <div className="min-h-screen bg-[#1f242d] text-[#c4cfde] font-bodyFont flex flex-col pt-20">
      {/* HEADER: FIXED DI BAWAH NAVBAR UTAMA */}
      <header className="fixed top-20 left-0 right-0 z-[60] bg-[#1f242d]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobNavOpen(true)}
              className="md:hidden p-2 bg-[#1e2024] rounded-lg border border-white/5"
            >
              <div className="w-4 h-[2px] bg-[#0ef] mb-1"></div>
              <div className="w-2 h-[2px] bg-[#0ef]"></div>
            </button>
            <h1 className="text-white font-black text-[9px] uppercase tracking-[0.2em] hidden sm:block">
              UNIT // <span className="text-[#0ef]">{packageName}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#1e2024] px-4 py-1.5 rounded-lg border border-white/5">
              <p
                className={`text-base font-black tabular-nums font-titleFont ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-[#0ef]"}`}
              >
                {formatTime(timeLeft)}
              </p>
            </div>
            <button
              onClick={handleFinish}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all"
            >
              FINISH
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto relative mt-16">
        {/* SIDEBAR NAVIGATION */}
        <div
          className={`fixed inset-y-0 left-0 z-[70] w-64 md:relative md:z-0 md:block transition-transform duration-500 ${isMobNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div
            className="absolute inset-0 bg-[#1f242d]/90 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobNavOpen(false)}
          />
          <aside className="relative w-64 bg-[#1e2024]/50 border-r border-white/5 p-6 h-full md:sticky md:top-36 md:h-[calc(100vh-144px)] overflow-y-auto custom-scrollbar">
            {renderSidebarContent()}
          </aside>
        </div>

        {/* QUESTION AREA */}
        <main className="flex-1 p-6 md:p-12 lg:p-16 flex justify-center selection:bg-[#0ef] selection:text-[#1f242d]">
          <div className="w-full max-w-2xl">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-[#0ef] shadow-[0_0_10px_#0ef] transition-all duration-700"
                style={{
                  width: `${((currentIndex + 1) / (questions.length || 1)) * 100}%`,
                }}
              />
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-[10px] font-black text-[#0ef] uppercase tracking-widest">
                Q. {currentIndex + 1} / {questions.length}
              </span>
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                {questions[currentIndex]?.category}
              </span>
            </div>

            {/* Media Area */}
            {questions[currentIndex]?.audio && (
              <div className="mb-8 p-4 bg-[#1e2024] rounded-2xl border border-[#0ef]/10 shadow-inner">
                <audio
                  ref={audioRef}
                  key={questions[currentIndex].audio}
                  src={questions[currentIndex].audio}
                  controls
                  className="w-full filter invert"
                />
              </div>
            )}

            {questions[currentIndex]?.image && (
              <div className="mb-8 rounded-2xl overflow-hidden border border-white/5 bg-black/20 p-2 shadow-inner group">
                <img
                  src={questions[currentIndex].image}
                  alt="Ref"
                  className="w-full h-auto max-h-[350px] object-contain mx-auto group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}

            {/* Question Text */}
            <h2
              className="text-xl md:text-2xl font-bold text-white leading-relaxed mb-10 font-titleFont"
              dangerouslySetInnerHTML={{
                __html: questions[currentIndex]?.questionText,
              }}
            />

            {/* Options Area */}
            <div className="grid grid-cols-1 gap-3">
              {questions[currentIndex]?.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setUserAnswers({ ...userAnswers, [currentIndex]: i })
                  }
                  className={`w-full p-5 rounded-xl border transition-all flex items-center gap-4 text-left group
                    ${
                      userAnswers[currentIndex] === i
                        ? "bg-[#0ef] border-[#0ef] text-[#1f242d] shadow-lg shadow-[#0ef]/10"
                        : "bg-[#1e2024] border-white/5 hover:border-white/20 text-[#c4cfde]"
                    }`}
                >
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0
                    ${userAnswers[currentIndex] === i ? "bg-[#1f242d] text-[#0ef]" : "bg-[#1f242d] text-[#c4cfde]/30 group-hover:text-[#0ef]"}`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm md:text-base font-semibold">
                    {opt}
                  </span>
                </button>
              ))}
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex justify-between mt-12 pt-8 border-t border-white/5">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="px-6 py-3 rounded-xl bg-[#1e2024] text-[10px] font-black uppercase tracking-widest text-[#c4cfde]/40 hover:text-white disabled:opacity-0 transition-all"
              >
                ← Back
              </button>
              <button
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-8 py-3 rounded-xl bg-[#0ef] text-[#1f242d] text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-[#0ef]/10"
              >
                Next Task →
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE FLOATING NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#1f242d]/90 backdrop-blur-md border-t border-white/5 flex gap-3 z-[60]">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="flex-1 py-4 rounded-xl bg-[#1e2024] text-[10px] font-black text-white/30 uppercase disabled:opacity-0 border border-white/5"
        >
          PREV
        </button>
        <button
          disabled={currentIndex === questions.length - 1}
          onClick={() => setCurrentIndex((prev) => prev + 1)}
          className="flex-[2] py-4 rounded-xl bg-[#0ef] text-[#1f242d] text-[10px] font-black uppercase shadow-lg shadow-[#0ef]/20"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
