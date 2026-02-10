"use client";
import { useState, useRef, useEffect } from "react";

export default function ListeningPlayer({ audioUrl }) {
  const [playCount, setPlayCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const MAX_PLAYS = 2;

  // ... (Sama seperti logic sebelumnya, ganti return JSX)

  return (
    <div className="neu-card p-8 flex items-center gap-8 my-10 border border-white/5">
      <button
        onClick={handlePlay}
        disabled={isPlaying || playCount >= MAX_PLAYS}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
          isPlaying || playCount >= MAX_PLAYS
            ? "bg-[#1c1e22] text-slate-700 shadow-inner"
            : "neu-button text-2xl shadow-[0_0_20px_rgba(255,1,79,0.2)]"
        }`}
      >
        {isPlaying ? "🔊" : "▶️"}
      </button>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Listening Session
          </span>
          <span
            className={`text-[10px] font-black px-3 py-1 rounded-full ${
              MAX_PLAYS - playCount === 0
                ? "bg-red-500/10 text-red-500"
                : "bg-[#ff014f]/10 text-[#ff014f]"
            }`}
          >
            {MAX_PLAYS - playCount}X SISA
          </span>
        </div>
        <div className="h-2 w-full bg-[#1c1e22] rounded-full overflow-hidden shadow-inner p-[2px]">
          <div
            className="h-full bg-gradient-to-r from-[#ff014f] to-[#d11414] rounded-full transition-all duration-300 shadow-[0_0_10px_#ff014f]"
            style={{
              width: isPlaying
                ? "100%"
                : playCount >= MAX_PLAYS
                  ? "100%"
                  : "0%",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
