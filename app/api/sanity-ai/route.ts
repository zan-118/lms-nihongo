import { NextResponse } from "next/server";

// CORS Headers helper
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // In production, consider limiting to specific domains
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

    // Determine target provider
    let targetUrl = `${AI_BASE_URL}/chat/completions`;
    let targetKey = AI_API_KEY;
    let targetModel = AI_MODEL;
    let isFallback = false;

    // If we are in production and pointed to localhost, we MUST use Gemini fallback if available
    if (isProduction && isLocalhost) {
      if (GEMINI_API_KEY) {
        console.log("Production detected with localhost proxy: Forcing Gemini fallback.");
        targetUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
        targetKey = GEMINI_API_KEY;
        targetModel = "gemini-1.5-flash";
        isFallback = true;
      } else {
        return NextResponse.json(
          { error: "Configuration Error: AI_BASE_URL points to localhost in production, but GEMINI_API_KEY is missing." },
          { status: 500, headers: corsHeaders }
        );
      }
    }

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

    let response;
    try {
      response = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${targetKey}`,
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [
            { role: "system", content: "You are a Japanese language expert." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        }),
      });
    } catch (fetchError: any) {
      // If primary fetch failed and we haven't tried fallback yet, try it now
      if (!isFallback && GEMINI_API_KEY) {
        console.warn("Primary AI provider failed, trying Gemini fallback...", fetchError.message);
        response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GEMINI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gemini-1.5-flash",
            messages: [
              { role: "system", content: "You are a Japanese language expert." },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
          }),
        });
      } else {
        throw fetchError;
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = "AI provider returned an error";
      
      try {
        const errorJson = JSON.parse(errorText);
        // Handle standard OpenAI-compatible error format or Google-specific format
        errorMsg = errorJson.error?.message || errorJson.message || errorText || errorMsg;
      } catch (e) {
        errorMsg = errorText || errorMsg;
      }
      
      console.error(`AI Provider Error (${response.status}):`, errorMsg);
      return NextResponse.json(
        { error: `AI Provider Error: ${errorMsg}` },
        { status: response.status, headers: corsHeaders }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("AI returned an empty or invalid response");
    }
    
    // Parse the JSON content from the assistant
    let data;
    try {
      // Clean potential markdown formatting if the model ignored response_format
      const cleanJson = content.replace(/```json|```/g, "").trim();
      data = JSON.parse(cleanJson);
    } catch (e) {
      console.error("JSON Parse Error:", content);
      throw new Error("AI returned invalid JSON format");
    }

    // STRICT VALIDATION
    const rawExamples = Array.isArray(data.examples) ? data.examples : [];
    const cleanExamples = rawExamples.filter((ex: any) => 
      ex && typeof ex === 'object' && ex.jp && ex.id
    );

    const validatedData = {
      mnemonic: typeof data.mnemonic === 'string' ? data.mnemonic : "",
      examples: cleanExamples.map((ex: any) => ({
        jp: String(ex.jp),
        id: String(ex.id),
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
