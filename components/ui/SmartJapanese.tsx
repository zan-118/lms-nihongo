/**
 * @file furigana.tsx
 * @description Utilitas cerdas untuk memisahkan Kanji dan Hiragana agar Furigana 
 * hanya muncul di atas Kanji saja.
 */

import React from "react";

/**
 * Membedah kata menjadi potongan-potongan (chunks) yang memisahkan Kanji dan Hiragana.
 * Contoh: word="食べ物", reading="たべもの" 
 * Hasil: [{text: "食", furi: "た"}, {text: "べ"}, {text: "物", furi: "もの"}]
 */
export function splitFurigana(word: string, reading: string) {
  if (!word) return [];
  if (!reading || word === reading) return [{ text: word }];

  // Clean the reading string from spaces for better anchor matching
  const cleanReading = reading.replace(/\s+/g, "");

  const isKanji = (char: string) => {
    const code = char.charCodeAt(0);
    return (code >= 0x4e00 && code <= 0x9faf) || char === "々";
  };

  const chunks: { text: string; furi?: string }[] = [];
  let wIdx = 0;
  let rIdx = 0;

  while (wIdx < word.length) {
    if (!isKanji(word[wIdx])) {
      // Non-kanji segment (Hiragana/Katakana/Punctuation/Spaces)
      const start = wIdx;
      while (wIdx < word.length && !isKanji(word[wIdx])) {
        wIdx++;
      }
      const segment = word.substring(start, wIdx);
      chunks.push({ text: segment });
      
      // Sync rIdx: skip identical characters and whitespace in reading
      const cleanSegment = segment.replace(/\s+/g, "");
      if (cleanSegment) {
        const rStart = cleanReading.indexOf(cleanSegment, rIdx);
        if (rStart !== -1) {
          rIdx = rStart + cleanSegment.length;
        }
      }
    } else {
      // Kanji segment
      const start = wIdx;
      while (wIdx < word.length && isKanji(word[wIdx])) {
        wIdx++;
      }
      const kanjiSegment = word.substring(start, wIdx);
      
      // Find next anchor in word to bound the reading
      let nextAnchor = "";
      let tempW = wIdx;
      while (tempW < word.length && nextAnchor === "") {
        const anchorStart = tempW;
        while (tempW < word.length && !isKanji(word[tempW])) {
          tempW++;
        }
        nextAnchor = word.substring(anchorStart, tempW).replace(/\s+/g, "");
      }

      let rEnd;
      if (nextAnchor) {
        // Find the anchor, but ensure it's not too far if the kanji is short
        const searchEnd = Math.min(cleanReading.length, rIdx + kanjiSegment.length * 10 + 10);
        rEnd = cleanReading.indexOf(nextAnchor, rIdx);
        
        // If anchor not found or suspiciously far, try to bound it by kanji count
        if (rEnd === -1 || rEnd > searchEnd) {
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
export function SmartJapanese({ word, furigana, className = "" }: { word: string; furigana?: string; className?: string }) {
  if (!word) return <span className={className}>{furigana}</span>;
  if (!furigana || word === furigana) {
    return <span className={className}>{word}</span>;
  }

  const chunks = splitFurigana(word, furigana);

  return (
    <span className={className}>
      {chunks.map((chunk, i) => (
        chunk.furi ? (
          <ruby key={i} className="font-japanese">
            {chunk.text}
            <rt className="text-[0.55em] font-bold leading-none mb-1 select-none opacity-90 tracking-normal">
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
