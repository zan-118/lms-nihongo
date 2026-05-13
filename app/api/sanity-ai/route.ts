import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { word, type } = await req.json();

    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    const baseUrl = process.env.AI_BASE_URL || "http://localhost:20128/v1";
    const apiKey = process.env.AI_API_KEY || "sk-9router";
    const model = process.env.AI_MODEL || "cc/gemini-2-flash";

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

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "You are a Japanese language expert." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "9router request failed");
    }

    const result = await response.json();
    const content = result.choices[0].message.content;
    
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
    // Ensure examples is always an array and filter out any null/undefined/invalid items
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

    return NextResponse.json(validatedData);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    console.error("AI Error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
