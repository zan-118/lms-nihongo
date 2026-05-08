"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  Hash 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useKanjiSvg } from "../hooks/useKanjiSvg";
import { PlaybackStatus } from "../types";

interface KanjiStrokePlayerProps {
  character: string;
  sanitySvg?: string;
  strokeColor?: string;
  size?: number;
}

export default function KanjiStrokePlayer({
  character,
  sanitySvg,
  strokeColor = "#a855f7",
  size = 250,
}: KanjiStrokePlayerProps) {
  const { data, loading, error } = useKanjiSvg(character, sanitySvg);
  
  // Playback State
  const [status, setStatus] = useState<PlaybackStatus>("paused");
  const [speed, setSpeed] = useState(1);
  const [currentStroke, setCurrentStroke] = useState(-1); // -1 means show nothing/static
  const [showNumbers, setShowNumbers] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [strokeTrigger, setStrokeTrigger] = useState(0);



  // Constants
  const BASE_STROKE_DURATION = 0.8;

  const handleNext = useCallback(() => {
    if (!data) return;
    setCurrentStroke((prev) => {
      if (prev >= data.strokes.length - 1) {
        setStatus("finished");
        return prev;
      }
      setStrokeTrigger((s) => s + 1);
      return prev + 1;
    });

  }, [data]);

  const handlePrev = () => {
    setCurrentStroke((prev) => (prev <= 0 ? 0 : prev - 1));
    setStrokeTrigger((s) => s + 1);
  };


  const handleReset = () => {
    setResetKey((prev) => prev + 1);
    setCurrentStroke(0);
    setStatus("playing");
  };


  const togglePlay = () => {
    if (status === "playing") {
      setStatus("paused");
    } else {
      if (status === "finished" || currentStroke === -1) {
        setCurrentStroke(0);
      }
      setStatus("playing");
    }
  };

  // Auto-play logic
  useEffect(() => {
    if (status === "playing" && currentStroke === -1) {
       setCurrentStroke(0);
    }
  }, [status, currentStroke]);

  if (loading) return (
    <div className="flex items-center justify-center bg-card/20 backdrop-blur-xl rounded-3xl border border-white/10" style={{ width: size, height: size }}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  if (error || !data) return (
    <div className="flex items-center justify-center bg-card/20 backdrop-blur-xl rounded-3xl border border-white/10 text-destructive text-xs p-4 text-center" style={{ width: size, height: size }}>
      Gagal memuat animasi kanji.
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {/* CYBER-GLASS PLAYER CONTAINER */}
      <div 
        className="relative bg-card/40 backdrop-blur-2xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden group p-8"

        style={{ width: size + 64, height: size + 64 }}
      >
        {/* Neon Glow Border */}
        <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-white/10 group-hover:ring-primary/30 transition-all duration-500" />
        
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

        <svg
          key={resetKey}
          viewBox={data.viewBox}
          className="relative w-full h-full z-10"
        >

          {/* Static Background Strokes (Light Gray) */}
          {data.strokes.map((stroke) => (
            <path
              key={`bg-${stroke.index}`}
              d={stroke.path}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground/10"


            />
          ))}

          {/* Animated Strokes */}
          {data.strokes.map((stroke) => {
            const isVisible = stroke.index <= currentStroke;
            const isAnimating = stroke.index === currentStroke && status === "playing";

            return (
              <motion.path
                key={`anim-${stroke.index}-${stroke.index === currentStroke && status === "playing" ? `active-${strokeTrigger}` : 'static'}`}
                d={stroke.path}


                fill="none"
                stroke={strokeColor}
                strokeWidth="5"

                strokeLinecap="round"
                strokeLinejoin="round"
                initial={
                  stroke.index === currentStroke && status === "playing"
                    ? { pathLength: 0, opacity: 0 }
                    : stroke.index <= currentStroke 
                      ? { pathLength: 1, opacity: 1 } 
                      : { pathLength: 0, opacity: 0 }
                }
                animate={{ 
                  pathLength: isVisible ? 1 : 0,
                  opacity: isVisible ? 1 : 0
                }}


                transition={{
                  duration: BASE_STROKE_DURATION / speed,
                  ease: "easeInOut",
                }}
                onAnimationComplete={() => {
                  if (isAnimating) {
                    handleNext();
                  }
                }}
                style={{
                  filter: isAnimating ? `drop-shadow(0 0 8px ${strokeColor})` : "none",
                }}
              />
            );
          })}

          {/* Stroke Numbers */}
          <AnimatePresence>
            {showNumbers && data.numbers.map((num, i) => (
              (currentStroke === -1 || i <= currentStroke) && (
                <motion.text
                  key={`num-${i}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.4, scale: 1 }}
                  exit={{ opacity: 0 }}
                  x={num.x}
                  y={num.y}
                  fontSize="4"
                  fontWeight="bold"
                  className="pointer-events-none select-none font-mono opacity-80 fill-primary"



                >
                  {num.value}
                </motion.text>
              )
            ))}
          </AnimatePresence>
        </svg>

        {/* Speed Indicator Badge */}
        <div className="absolute top-6 right-8 z-20">
          <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[8px] font-bold uppercase tracking-widest text-primary flex items-center gap-1">
            <Zap size={8} /> {speed}x SPEED
          </div>
        </div>
      </div>

      {/* PLAYBACK CONTROLS */}
      <div className="flex flex-col gap-4 w-full max-w-[320px]">
        <div className="grid grid-cols-5 gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="rounded-xl hover:bg-white/10"
          >
            <ChevronLeft size={18} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            className="rounded-xl bg-primary/10 text-primary hover:bg-primary/20 col-span-1"
          >
            {status === "playing" ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="rounded-xl hover:bg-white/10"
          >
            <ChevronRight size={18} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="rounded-xl hover:bg-white/10"
          >
            <RotateCcw size={18} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNumbers(!showNumbers)}
            className={`rounded-xl transition-colors ${showNumbers ? "text-primary bg-primary/5" : "text-muted-foreground"}`}
          >
            <Hash size={18} />
          </Button>
        </div>

        {/* Speed & Progress Info */}
        <div className="flex items-center justify-between px-2">
          <div className="flex gap-1">
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${
                  speed === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            Stroke {currentStroke + 1} / {data.strokes.length}
          </span>
        </div>
      </div>
    </div>
  );
}
