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

  const chunks: { text: string; furi?: string }[] = [];
  let wIdx = 0;
  let rIdx = 0;

  while (wIdx < word.length) {
    const char = word[wIdx];
    const isKanjiChar = wanakana.isKanji(char) || char === "々";

    if (!isKanjiChar) {
      // Segment Non-kanji (Hiragana, Katakana, Punctuation, Spaces)
      let segment = "";
      while (wIdx < word.length && !(wanakana.isKanji(word[wIdx]) || word[wIdx] === "々")) {
        const wChar = word[wIdx];
        segment += wChar;
        
        // Advanced rIdx if it matches (ignoring case/type)
        if (rIdx < reading.length) {
          const rChar = reading[rIdx];
          // Match if exactly the same, or if they are both kana and equivalent
          if (wChar === rChar || (wanakana.isKana(wChar) && wanakana.isKana(rChar) && wanakana.toHiragana(wChar) === wanakana.toHiragana(rChar))) {
            rIdx++;
          } else if (/\s/.test(wChar) && !/\s/.test(rChar)) {
            // Space in word but not in reading: just skip word index (handled by outer loop)
          } else if (!/\s/.test(wChar) && /\s/.test(rChar)) {
            // Space in reading but not in word: skip reading index
            rIdx++;
            // Re-check current wChar with next rChar
            continue;
          }
        }
        wIdx++;
      }
      chunks.push({ text: segment });
    } else {
      // Segment Kanji
      const start = wIdx;
      while (wIdx < word.length && (wanakana.isKanji(word[wIdx]) || word[wIdx] === "々")) {
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
        // Find the next occurrence of the anchor in reading, but don't look TOO far (max 10 chars per Kanji)
        const searchLimit = rIdx + kanjiSegment.length * 10;
        const searchArea = reading.substring(rIdx, searchLimit);
        const anchorPos = searchArea.indexOf(wanakana.toHiragana(nextAnchor));
        const anchorPosKatakana = searchArea.indexOf(nextAnchor);
        
        const foundPos = anchorPos !== -1 ? anchorPos : (anchorPosKatakana !== -1 ? anchorPosKatakana : -1);

        if (foundPos !== -1) {
          rEnd = rIdx + foundPos;
        } else {
          // Fallback if anchor not found within reasonable distance
          rEnd = Math.min(reading.length, rIdx + kanjiSegment.length * 3);
        }
      } else {
        rEnd = reading.length;
      }

      const readingSegment = reading.substring(rIdx, rEnd);
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
