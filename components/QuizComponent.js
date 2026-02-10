"use client";
import { useState } from "react";

export default function QuizComponent({ questions = [], packageId }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  if (!questions || questions.length === 0) return null;

  const handleAnswer = (index) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === questions[currentQuestion].correctAnswer)
      setScore((s) => s + 1);

    // Delay transisi ke soal berikutnya agar user bisa melihat jawaban benar
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion((c) => c + 1);
        setIsAnswered(false);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  // --- TAMPILAN SKOR AKHIR ---
  if (showScore)
    return (
      <div className="bg-[#1e2024] p-10 md:p-14 rounded-[2.5rem] text-center border border-[#0ef]/20 shadow-shadowOne relative overflow-hidden">
        {/* Glow Decor */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#0ef]/10 blur-[50px] rounded-full" />

        <p className="text-[#0ef] font-black text-[10px] tracking-[0.5em] mb-4 uppercase">
          Training Complete
        </p>
        <h2 className="text-4xl font-black text-white italic mb-2 tracking-tighter">
          SELESAI.
        </h2>

        <div className="py-10">
          <div className="text-7xl font-black text-white italic tracking-tighter leading-none">
            {Math.round((score / questions.length) * 100)}
            <span className="text-[#0ef] text-3xl">%</span>
          </div>
          <p className="text-[10px] font-bold text-[#c4cfde]/30 uppercase tracking-[0.2em] mt-4">
            Aptitude Mastery Level
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full py-5 bg-[#1e2024] shadow-shadowOne border border-[#0ef]/20 rounded-2xl text-[10px] text-[#0ef] font-black uppercase tracking-[0.3em] hover:bg-[#0ef] hover:text-[#1f242d] transition-all duration-300"
        >
          Re-initialize Session
        </button>
      </div>
    );

  const q = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto font-bodyFont">
      {/* HEADER QUIZ */}
      <div className="flex justify-between items-end mb-6 px-2">
        <div className="flex flex-col">
          <span className="text-[#0ef] font-black text-[9px] tracking-[0.4em] uppercase mb-1">
            Task_Sequence
          </span>
          <div className="h-1 w-12 bg-[#0ef] shadow-[0_0_10px_#0ef]" />
        </div>
        <span className="text-[#c4cfde]/30 font-black text-[10px] tracking-widest uppercase">
          Phase {currentQuestion + 1} // {questions.length}
        </span>
      </div>

      {/* CARD SOAL */}
      <div className="bg-[#1e2024] p-8 md:p-10 rounded-[2.5rem] border border-white/5 shadow-shadowOne relative">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-10 leading-relaxed italic font-titleFont tracking-tight">
          {q.questionText}
        </h3>

        <div className="space-y-4">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correctAnswer;
            const isSelected = idx === selectedAnswer;

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-5 text-left rounded-2xl transition-all duration-300 border flex items-center gap-5 group
                  ${
                    !isAnswered
                      ? "bg-[#1f242d] border-transparent hover:border-[#0ef]/40 shadow-inner shadow-black/20"
                      : isCorrect
                        ? "bg-green-500/10 border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                        : isSelected
                          ? "bg-red-500/10 border-red-500 text-red-400"
                          : "opacity-20 border-transparent scale-[0.98]"
                  }`}
              >
                {/* Huruf A, B, C */}
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 transition-colors
                  ${
                    !isAnswered
                      ? "bg-[#1e2024] text-[#c4cfde]/20 group-hover:text-[#0ef]"
                      : isCorrect
                        ? "bg-green-500 text-white"
                        : isSelected
                          ? "bg-red-500 text-white"
                          : "bg-transparent text-white/10"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>

                <span className="font-bold text-sm md:text-base tracking-tight">
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER DECOR */}
      <div className="mt-6 flex justify-center">
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-500 rounded-full ${i === currentQuestion ? "w-8 bg-[#0ef] shadow-[0_0_10px_#0ef]" : "w-2 bg-white/5"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
