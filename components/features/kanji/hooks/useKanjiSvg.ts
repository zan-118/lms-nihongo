import { useState, useEffect } from "react";
import { KanjiSvgData, StrokeData } from "../types";

/**
 * @file useKanjiSvg.ts
 * @description Hook untuk mengambil dan mem-parse data SVG Kanji dari Database (Supabase) atau GitHub KanjiVG.
 */

export function useKanjiSvg(character: string, strokeOrderSvg?: string) {
  const [data, setData] = useState<KanjiSvgData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!character) return;

    const fetchSvg = async () => {
      setLoading(true);
      setError(null);

      try {
        let svgText = "";

        // 1. Cek Database/Fallback
        if (strokeOrderSvg) {
          svgText = strokeOrderSvg;
        } else {
          // 2. Fetch dari GitHub KanjiVG
          const KANJIVG_URL = "https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji";
          const code = character.charCodeAt(0).toString(16).padStart(5, "0");
          const url = `${KANJIVG_URL}/${code}.svg`;
          
          const res = await fetch(url);
          if (!res.ok) throw new Error("Gagal mengambil data dari KanjiVG");
          svgText = await res.text();
        }

        // 3. Parsing SVG
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svg = doc.querySelector("svg");

        if (!svg) throw new Error("Format SVG tidak valid");

        const strokes: StrokeData[] = [];
        const numbers: { x: string; y: string; value: string }[] = [];

        // Ambil paths (goresan)
        const paths = doc.querySelectorAll("path");
        paths.forEach((p, i) => {
          const d = p.getAttribute("d");
          if (d) {
            strokes.push({ path: d, index: i });
          }
        });

        // Ambil numbers (urutan)
        const texts = doc.querySelectorAll("text");
        texts.forEach((t) => {
          const x = t.getAttribute("transform")?.match(/translate\(([\d.]+), ([\d.]+)\)/);
          if (x) {
            numbers.push({
              x: x[1],
              y: x[2],
              value: t.textContent || "",
            });
          } else {
             // Fallback jika tidak pakai translate
             numbers.push({
               x: t.getAttribute("x") || "0",
               y: t.getAttribute("y") || "0",
               value: t.textContent || "",
             });
          }
        });

        setData({
          character,
          strokes,
          numbers,
          viewBox: svg.getAttribute("viewBox") || "0 0 109 109",
        });
      } catch (err) {
        console.error("Kanji Parser Error:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchSvg();
  }, [character, strokeOrderSvg]);

  return { data, loading, error };
}
