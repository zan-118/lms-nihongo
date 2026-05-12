import { NextResponse } from "next/server";
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
    // Tunggu inisialisasi selesai jika sedang berjalan
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return kuroshiro;
  }

  isInitializing = true;
  try {
    const instance = new Kuroshiro();
    await instance.init(new KuromojiAnalyzer());
    kuroshiro = instance;
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
