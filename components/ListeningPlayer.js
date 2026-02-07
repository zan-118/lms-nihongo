"use client";
import { useState, useRef, useEffect } from "react";

export default function ListeningPlayer({ audioUrl }) {
  const [playCount, setPlayCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const MAX_PLAYS = 2;

  return (
    <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl flex items-center gap-6">
      <button
        onClick={() => {
          if (playCount < MAX_PLAYS) {
            audioRef.current.play();
            setIsPlaying(true);
          } else {
            alert("Batas putar habis.");
          }
        }}
        disabled={isPlaying || playCount >= MAX_PLAYS}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
          isPlaying || playCount >= MAX_PLAYS
            ? "bg-slate-200 text-slate-400"
            : "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
        }`}
      >
        {isPlaying ? "🔊" : "▶️"}
      </button>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Audio Listening
          </span>
          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded italic">
            {MAX_PLAYS - playCount}x SISA
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-[30s]"
            style={{ width: isPlaying ? "100%" : "0%" }}
          ></div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => {
          setIsPlaying(false);
          setPlayCount((prev) => prev + 1);
        }}
      />
    </div>
  );
}
