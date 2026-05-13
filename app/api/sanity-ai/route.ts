import { NextResponse } from "next/server";

// CORS Headers helper
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

async function callGeminiDirect(prompt: string, apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ 
        role: "user",
        parts: [{ text: prompt }] 
      }],
      systemInstruction: {
        parts: [{ text: "You are a Japanese language expert. Respond only in pure JSON." }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errorBody}`);
  }

  const result = await response.json();
  return result.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export async function POST(req: Request) {
  try {
    const { word, type } = await req.json();

    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400, headers: corsHeaders });
    }

    const AI_BASE_URL = process.env.AI_BASE_URL || "http://localhost:20128/v1";
    const AI_API_KEY = process.env.AI_API_KEY || "sk-9router";
    const AI_MODEL = process.env.AI_MODEL || "cc/gemini-2-flash";
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    const isProduction = process.env.NODE_ENV === "production";
    const isLocalhost = AI_BASE_URL.includes("localhost") || AI_BASE_URL.includes("127.0.0.1");

    const prompt = `
      Hasilkan konten untuk kata: "${word}" (Tipe: ${type}).
      Berikan respon dalam format JSON murni:
      {
        "mnemonic": "Mnemonic pendek dan kreatif dalam Bahasa Indonesia.",
        "examples": [
          {
            "jp": "Contoh kalimat 1 (Kanji/Kana)",
            "furigana": "Cara baca kalimat 1 menggunakan format furigana standar [kanji](furigana) atau kana saja.",
            "romaji": "Romaji kalimat 1",
            "id": "Terjemahan Bahasa Indonesia"
          },
          {
            "jp": "Contoh kalimat 2",
            "furigana": "Cara baca kalimat 2",
            "romaji": "Romaji kalimat 2",
            "id": "Terjemahan Bahasa Indonesia"
          }
        ]
      }
    `;

    let content = "";

    // CASE 1: Production Bypass (Avoid calling localhost proxy from Vercel)
    if (isProduction && isLocalhost && GEMINI_API_KEY) {
      console.log("Production bypass: Calling Gemini REST API directly.");
      content = await callGeminiDirect(prompt, GEMINI_API_KEY);
    } 
    // CASE 2: Normal Flow (9router or local proxy)
    else {
      try {
        const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AI_API_KEY}`,
          },
          body: JSON.stringify({
            model: AI_MODEL,
            messages: [
              { role: "system", content: "You are a Japanese language expert. Provide detailed furigana and romaji." },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          // Fallback if primary fails
          if (GEMINI_API_KEY) {
            console.warn(`Primary provider failed (${response.status}). Trying Gemini fallback...`);
            content = await callGeminiDirect(prompt, GEMINI_API_KEY);
          } else {
            return NextResponse.json(
              { error: `AI Provider Error: ${errorText}` },
              { status: response.status, headers: corsHeaders }
            );
          }
        } else {
          const result = await response.json();
          content = result.choices?.[0]?.message?.content || "";
        }
      } catch (fetchError: any) {
        // Fallback on network error
        if (GEMINI_API_KEY) {
          console.warn("Network error to primary provider, falling back to Gemini REST API...");
          content = await callGeminiDirect(prompt, GEMINI_API_KEY);
        } else {
          throw fetchError;
        }
      }
    }

    if (!content) {
      throw new Error("AI returned an empty response");
    }
    
    // Clean and Parse JSON
    let data;
    try {
      const cleanJson = content.replace(/```json|```/g, "").trim();
      data = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error. Content received:", content);
      throw new Error("AI returned invalid JSON format");
    }

    // STRICT VALIDATION & MAPPING
    const rawExamples = Array.isArray(data.examples) ? data.examples : [];
    const cleanExamples = rawExamples
      .filter((ex: any) => ex && typeof ex === 'object')
      .map((ex: any) => ({
        jp: String(ex.jp || ex.japanese || ""),
        id: String(ex.id || ex.indonesian || ex.en || ""),
        furigana: ex.furigana ? String(ex.furigana) : undefined,
        romaji: ex.romaji ? String(ex.romaji) : undefined,
      }))
      .filter(ex => ex.jp && ex.id);

    return NextResponse.json({
      mnemonic: String(data.mnemonic || ""),
      examples: cleanExamples
    }, { headers: corsHeaders });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Sanity AI Route Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500, headers: corsHeaders });
  }
}
