import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// CORS Headers helper
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
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

    let content = "";

    // CASE 1: Production Fallback to Native Gemini SDK
    if (isProduction && isLocalhost && GEMINI_API_KEY) {
      console.log("Production detected with localhost proxy: Using Native Google Gemini SDK.");
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "You are a Japanese language expert.",
        generationConfig: { responseMimeType: "application/json" }
      });
      
      const result = await model.generateContent(prompt);
      content = result.response.text();
    } 
    // CASE 2: Use Configured Provider (9router or local proxy)
    else {
      let response;
      try {
        response = await fetch(`${AI_BASE_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AI_API_KEY}`,
          },
          body: JSON.stringify({
            model: AI_MODEL,
            messages: [
              { role: "system", content: "You are a Japanese language expert." },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorMsg = "AI provider returned an error";
          
          try {
            const errorJson = JSON.parse(errorText);
            const actualError = Array.isArray(errorJson) ? errorJson[0] : errorJson;
            errorMsg = actualError.error?.message || actualError.message || errorText || errorMsg;
          } catch (e) {
            errorMsg = errorText || errorMsg;
          }
          
          // If primary fails and we have a Gemini key, try fallback to SDK
          if (GEMINI_API_KEY) {
            console.warn(`Primary provider failed (${response.status}): ${errorMsg}. Falling back to SDK...`);
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ 
              model: "gemini-1.5-flash",
              systemInstruction: "You are a Japanese language expert.",
              generationConfig: { responseMimeType: "application/json" }
            });
            const result = await model.generateContent(prompt);
            content = result.response.text();
          } else {
            return NextResponse.json(
              { error: `AI Provider Error: ${errorMsg}` },
              { status: response.status, headers: corsHeaders }
            );
          }
        } else {
          const result = await response.json();
          content = result.choices?.[0]?.message?.content;
        }
      } catch (fetchError: any) {
        if (GEMINI_API_KEY) {
          console.warn("Network error to primary provider, falling back to SDK...", fetchError.message);
          const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "You are a Japanese language expert.",
            generationConfig: { responseMimeType: "application/json" }
          });
          const result = await model.generateContent(prompt);
          content = result.response.text();
        } else {
          throw fetchError;
        }
      }
    }

    if (!content) {
      throw new Error("AI returned an empty or invalid response");
    }
    
    // Parse the JSON content
    let data;
    try {
      const cleanJson = content.replace(/```json|```/g, "").trim();
      data = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error:", content);
      throw new Error("AI returned invalid JSON format");
    }

    // STRICT VALIDATION
    const rawExamples = Array.isArray(data.examples) ? data.examples : [];
    const cleanExamples = rawExamples.filter((ex: any) => 
      ex && typeof ex === 'object' && (ex.jp || ex.japanese) && (ex.id || ex.indonesian || ex.en)
    );

    const validatedData = {
      mnemonic: typeof data.mnemonic === 'string' ? data.mnemonic : "",
      examples: cleanExamples.map((ex: any) => ({
        jp: String(ex.jp || ex.japanese),
        id: String(ex.id || ex.indonesian || ex.en),
        romaji: ex.romaji ? String(ex.romaji) : undefined,
        furigana: ex.furigana ? String(ex.furigana) : undefined
      }))
    };

    return NextResponse.json(validatedData, { headers: corsHeaders });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("Sanity AI Route Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500, headers: corsHeaders });
  }
}
