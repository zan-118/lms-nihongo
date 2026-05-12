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
      // 1. Tangani Segmen Non-Kanji (Hiragana, Katakana, Simbol, Spasi)
      let segment = "";
      while (wIdx < word.length && !wanakana.isKanji(word[wIdx]) && word[wIdx] !== "々") {
        const wChar = word[wIdx];
        segment += wChar;

        // Sinkronisasi rIdx: Majukan rIdx hanya jika karakternya cocok
        if (rIdx < reading.length) {
          const rChar = reading[rIdx];
          const wHira = wanakana.toHiragana(wChar);
          const rHira = wanakana.toHiragana(rChar);
          
          if (wHira === rHira || wChar === rChar) {
            rIdx++;
          } else if (/\s/.test(rChar)) {
            // Jika ada spasi di reading tapi tidak di word, lewati rIdx saja
            rIdx++;
            // Coba lagi cocokkan wChar dengan rChar berikutnya
            continue;
          }
        }
        wIdx++;
      }
      chunks.push({ text: segment });
    } else {
      // 2. Tangani Segmen Kanji
      const kanjiStart = wIdx;
      while (wIdx < word.length && (wanakana.isKanji(word[wIdx]) || word[wIdx] === "々")) {
        wIdx++;
      }
      const kanjiSegment = word.substring(kanjiStart, wIdx);

      // Cari "Jangkar" berikutnya: karakter non-kanji pertama setelah blok Kanji ini
      let nextAnchor = "";
      let anchorOccurrencesInWord = 0;
      if (wIdx < word.length) {
        nextAnchor = word[wIdx];
        // Hitung berapa kali jangkar ini muncul berurutan (misal: 'いい' di '言いました')
        let tempIdx = wIdx;
        while (tempIdx < word.length && word[tempIdx] === nextAnchor) {
          anchorOccurrencesInWord++;
          tempIdx++;
        }
      }

      let rEnd = rIdx;
      if (nextAnchor) {
        const anchorHira = wanakana.toHiragana(nextAnchor);
        
        // Cari posisi jangkar di teks pembacaan. 
        // Penting: Kita harus mencari posisi yang logis, tidak boleh rIdx itu sendiri 
        // jika itu bagian dari pembacaan Kanji (kasus '言いました' -> 'いいました').
        let searchIdx = rIdx;
        let matchCount = 0;
        let found = false;

        // Cari kemunculan ke-N dari jangkar di reading (sesuai posisi di word)
        while (searchIdx < reading.length) {
          if (wanakana.toHiragana(reading[searchIdx]) === anchorHira) {
            matchCount++;
            // Jika kita menemukan jangkar yang posisinya "masuk akal" 
            // (memberi ruang untuk pembacaan Kanji minimal 1 karakter)
            if (searchIdx >= rIdx + 1) {
               rEnd = searchIdx;
               found = true;
               break;
            }
          }
          searchIdx++;
        }

        if (!found) {
          // Fallback: Jika tidak ketemu, gunakan estimasi panjang (3 hiragana per kanji)
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
