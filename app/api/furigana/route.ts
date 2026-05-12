import { NextResponse } from "next/server";
import path from "path";
// @ts-ignore
import Kuroshiro from "kuroshiro";
// @ts-ignore
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

/**
 * @file route.ts
 * @description API endpoint untuk mengonversi teks Jepang (Kanji) menjadi Hiragana menggunakan Kuroshiro.
 * Menggunakan singleton pattern untuk menghindari inisialisasi ulang kamus Kuromoji yang berat.
 */

let kuroshiro: any = null;
let isInitializing = false;

async function getKuroshiro() {
  if (kuroshiro) return kuroshiro;
  
  if (isInitializing) {
    console.log("Kuroshiro is already initializing, waiting...");
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return kuroshiro;
  }

  isInitializing = true;
  console.log("Initializing Kuroshiro for the first time...");
  try {
    // Handle potential CJS/ESM interop issues
    const KConstructor = (Kuroshiro as any).default || Kuroshiro;
    const AConstructor = (KuromojiAnalyzer as any).default || KuromojiAnalyzer;

    const instance = new KConstructor();
    console.log("Loading Kuromoji Analyzer with explicit dict path...");
    // Menunjuk langsung ke folder dict di node_modules/kuromoji
    const dictPath = path.join(process.cwd(), "node_modules", "kuromoji", "dict");
    
    await instance.init(new AConstructor({ dictPath }));
    kuroshiro = instance;
    console.log("Kuroshiro Initialization Successful!");
    return kuroshiro;
  } catch (error) {
    console.error("Kuroshiro Init Error:", error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ hiragana: "" });
    }

    const engine = await getKuroshiro();
    const result = await engine.convert(text, {
      to: "hiragana",
      mode: "normal"
    });

    return NextResponse.json({ hiragana: result });
  } catch (error: any) {
    console.error("Furigana API Error:", error);
    return NextResponse.json(
      { error: "Gagal mengonversi teks ke Hiragana", details: error.message },
      { status: 500 }
    );
  }
}
