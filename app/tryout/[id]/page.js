"use client";
import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function TryoutPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null); // Mulai dengan null agar tidak bentrok saat hydrasi
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = `timer_${params.id}`;

  // 1. Inisialisasi Timer dari LocalStorage atau Default
  useEffect(() => {
    const savedTime = localStorage.getItem(STORAGE_KEY);
    if (savedTime) {
      setTimeLeft(parseInt(savedTime));
    } else {
      setTimeLeft(3600); // 60 menit default
    }
  }, [STORAGE_KEY]);

  // 2. Fetch Soal
  useEffect(() => {
    const fetchQuestions = async () => {
      const packageId = decodeURIComponent(params.id);
      const { data } = await supabase
        .from("questions")
        .select("*")
        .eq("package_id", packageId);
      if (data) setQuestions(data);
      setLoading(false);
    };
    fetchQuestions();
  }, [params.id]);

  // 3. Logika Timer & Save to LocalStorage
  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev > 0 ? prev - 1 : 0;
        // Simpan ke localStorage agar jika refresh tidak reset
        localStorage.setItem(STORAGE_KEY, newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, STORAGE_KEY]);

  // 4. Auto-submit & Cleanup
  const handleSubmit = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === parseInt(q.correct_answer)) score++;
    });
    // Hapus timer setelah selesai agar tidak tersimpan untuk pengerjaan berikutnya
    localStorage.removeItem(STORAGE_KEY);
    router.push(
      `/tryout/${params.id}/result?score=${score}&total=${questions.length}`
    );
  };

  useEffect(() => {
    if (timeLeft === 0 && !loading && questions.length > 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (loading || timeLeft === null)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p className="font-black italic animate-pulse text-slate-300 text-2xl tracking-tighter">
          MENYIAPKAN UJIAN...
        </p>
      </div>
    );

  const currentQuestion = questions[currentIdx];
  const options =
    typeof currentQuestion?.options === "string"
      ? JSON.parse(currentQuestion.options)
      : currentQuestion?.options;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24 font-sans selection:bg-blue-100">
      {/* Top Navigation */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-100 p-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <button
            onClick={() => {
              if (
                confirm(
                  "Yakin ingin keluar? Progres waktu akan tetap berjalan."
                )
              )
                router.back();
            }}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition"
          >
            ← Keluar
          </button>

          <div className="bg-slate-900 text-white px-8 py-2.5 rounded-full font-mono font-black shadow-xl shadow-slate-200 flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={handleSubmit}
            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:scale-110 transition"
          >
            Selesai
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto p-6 mt-8">
        {/* Progress Bar Visual */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full mb-12 overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Area */}
        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-slate-200/60 border border-slate-50 mb-10 transform transition-all">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
              Question {currentIdx + 1} / {questions.length}
            </span>
            {answers[currentIdx] !== undefined && (
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest italic">
                ✓ Terjawab
              </span>
            )}
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-12 tracking-tighter leading-[1.1] italic">
            {currentQuestion?.question_text}
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => setAnswers({ ...answers, [currentIdx]: i })}
                className={`w-full text-left p-6 rounded-[2rem] font-bold transition-all border-2 flex items-center gap-5 group ${
                  answers[currentIdx] === i
                    ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-inner"
                    : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-white"
                }`}
              >
                <span
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[10px] font-black transition-all ${
                    answers[currentIdx] === i
                      ? "bg-blue-600 text-white shadow-lg rotate-12"
                      : "bg-white text-slate-300 group-hover:text-slate-500"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-lg">{opt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="flex justify-between items-center px-4">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
            className="text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:text-blue-600 transition"
          >
            ← PREV
          </button>

          <div className="flex gap-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  currentIdx === i ? "bg-blue-600 w-4" : "bg-slate-200"
                }`}
              ></div>
            ))}
          </div>

          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl shadow-blue-200 hover:bg-slate-900 transition-all active:scale-95"
            >
              SUBMIT
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(currentIdx + 1)}
              className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black hover:bg-blue-600 transition-all active:scale-95 uppercase tracking-widest"
            >
              NEXT →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
