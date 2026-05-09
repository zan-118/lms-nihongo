import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { word, type } = await req.json();

    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Anda adalah asisten pakar bahasa Jepang untuk platform NihongoRoute.
      Hasilkan konten untuk kata: "${word}" (Tipe: ${type}).
      
      Berikan respon dalam format JSON murni tanpa markdown:
      {
        "mnemonic": "Mnemonic pendek dan kreatif dalam Bahasa Indonesia untuk mengingat kata ini.",
        "examples": [
          {
            "jp": "Contoh kalimat 1 dalam Bahasa Jepang (Kanji + Furigana jika perlu)",
            "romaji": "Romaji kalimat 1",
            "id": "Terjemahan kalimat 1 dalam Bahasa Indonesia"
          },
          {
            "jp": "Contoh kalimat 2 dalam Bahasa Jepang",
            "romaji": "Romaji kalimat 2",
            "id": "Terjemahan kalimat 2 dalam Bahasa Indonesia"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Bersihkan output jika Gemini membungkusnya dalam ```json
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Gemini AI Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
