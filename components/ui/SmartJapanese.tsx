/**
 * @file furigana.tsx
 * @description Utilitas cerdas untuk memisahkan Kanji dan Hiragana agar Furigana 
 * hanya muncul di atas Kanji saja.
 */

import React from "react";
import * as wanakana from "wanakana";

/**
 * Membedah kata menjadi potongan-potongan (chunks) yang memisahkan Kanji dan Hiragana.
 * Contoh: word="食べ物", reading="たべもの" 
 * Hasil: [{text: "食", furi: "た"}, {text: "べ"}, {text: "物", furi: "もの"}]
 */
export function splitFurigana(word: string, reading: string) {
  if (!word) return [];
  if (!reading || word === reading) return [{ text: word }];

  const cleanReading = reading.replace(/\s+/g, "");

  const isKanji = (char: string) => wanakana.isKanji(char) || char === "々";

  // Helper to compare characters regardless of Katakana/Hiragana
  const areKanaEqual = (c1: string, c2: string) => {
    if (c1 === c2) return true;
    return wanakana.toHiragana(c1) === wanakana.toHiragana(c2);
  };

  const chunks: { text: string; furi?: string }[] = [];
  let wIdx = 0;
  let rIdx = 0;

  while (wIdx < word.length) {
    if (!isKanji(word[wIdx])) {
      // Segment Non-kanji
      const start = wIdx;
      while (wIdx < word.length && !isKanji(word[wIdx])) {
        // Advance rIdx if it matches current non-kanji char
        if (rIdx < cleanReading.length && areKanaEqual(word[wIdx], cleanReading[rIdx])) {
          rIdx++;
        }
        wIdx++;
      }
      chunks.push({ text: word.substring(start, wIdx) });
    } else {
      // Segment Kanji
      const start = wIdx;
      while (wIdx < word.length && isKanji(word[wIdx])) {
        wIdx++;
      }
      const kanjiSegment = word.substring(start, wIdx);
      
      // Find the next non-kanji character to use as an anchor
      let nextAnchor = "";
      if (wIdx < word.length) {
        nextAnchor = word[wIdx];
      }

      let rEnd;
      if (nextAnchor) {
        // Find the next occurrence of the anchor in reading
        rEnd = cleanReading.indexOf(wanakana.toHiragana(nextAnchor), rIdx);
        // Fallback for Katakana anchor
        if (rEnd === -1) {
           rEnd = cleanReading.indexOf(nextAnchor, rIdx);
        }
        
        // Safety bound: furigana shouldn't be excessively long
        if (rEnd === -1 || rEnd > rIdx + kanjiSegment.length * 5) {
          rEnd = Math.min(cleanReading.length, rIdx + kanjiSegment.length * 3);
        }
      } else {
        rEnd = cleanReading.length;
      }

      const readingSegment = cleanReading.substring(rIdx, rEnd);
      chunks.push({ text: kanjiSegment, furi: readingSegment });
      rIdx = rEnd;
    }
  }

  return chunks;
}

/**
 * Komponen untuk merender teks Jepang dengan Furigana yang hanya muncul di atas Kanji.
 */
export function SmartJapanese({ 
  word, 
  furigana, 
  className = "",
  mode = "furigana"
}: { 
  word: string; 
  furigana?: string; 
  className?: string;
  mode?: "furigana" | "kanji" | "hiragana" | "romaji";
}) {
  if (!word) return <span className={className}>{furigana}</span>;
  
  if (mode === "romaji") {
    return <span className={className}>{wanakana.toRomaji(furigana || word)}</span>;
  }

  if (!furigana || word === furigana || mode === "kanji") {
    return <span className={className}>{word}</span>;
  }

  if (mode === "hiragana") {
    return <span className={className}>{furigana}</span>;
  }

  const chunks = splitFurigana(word, furigana);

  return (
    <span 
      className={className} 
      style={{ rubyPosition: 'over', rubyAlign: 'space-around' } as React.CSSProperties}
    >
      {chunks.map((chunk, i) => (
        chunk.furi ? (
          <ruby key={i} className="font-japanese">
            {chunk.text}
            <rt className="text-[0.55em] font-bold leading-none select-none opacity-90 tracking-normal text-muted-foreground">
              {chunk.furi}
            </rt>
          </ruby>
        ) : (
          <span key={i}>{chunk.text}</span>
        )
      ))}
    </span>
  );
}
