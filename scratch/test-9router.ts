/**
 * Script untuk mengetes koneksi 9router secara lokal.
 * Jalankan dengan: npx tsx scratch/test-9router.ts
 */

import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function test9Router() {
  const AI_BASE_URL = (process.env.AI_BASE_URL || "http://127.0.0.1:20128/v1").replace("localhost", "127.0.0.1");
  const AI_API_KEY = process.env.AI_API_KEY;
  const AI_MODEL = process.env.AI_MODEL || "ag/gemini-3-flash";

  console.log(`[TEST] URL: ${AI_BASE_URL}`);
  console.log(`[TEST] Model: ${AI_MODEL}`);
  console.log(`[TEST] API Key: ${AI_API_KEY ? 'Terdeteksi' : 'TIDAK TERDETEKSI'}`);

  try {
    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: "user", content: "Say hello in Japanese and confirm if you can see this message." }
        ],
        max_tokens: 50,
        stream: false
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`[FAILED] Status: ${response.status}`);
      console.error(`[FAILED] Error: ${error}`);
      return;
    }

    const data = await response.json();
    console.log(`[SUCCESS] Response:`, data.choices?.[0]?.message?.content);
    console.log(`[SUCCESS] 9router Terhubung & Berfungsi!`);
  } catch (err: any) {
    console.error(`[ERROR] Gagal terhubung ke 9router: ${err.message}`);
    console.log(`PENTING: Pastikan 9router sudah dijalankan dengan: 9router --config 9router.yaml`);
  }
}

test9Router();
