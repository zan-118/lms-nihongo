import { NextRequest, NextResponse } from "next/server";
import { sanityFetch } from "@/lib/sanity.fetch";
import { MasterCardData } from "@/components/features/flashcards/master/types";

const CARDS_QUERY = `*[_id in $ids] {
  _id,
  "word": coalesce(jisho, word),
  meaning,
  romaji,
  furigana,
  category,
  kanjiDetails
}`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json({ error: "Parameter 'ids' wajib diisi." }, { status: 400 });
  }

  const ids = idsParam.split(",").filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const data = await sanityFetch<MasterCardData[]>({
      query: CARDS_QUERY,
      params: { ids },
      tags: ["vocab", "verb_dictionary"],
    });

    return NextResponse.json(data ?? []);
  } catch (error) {
    console.error("[API /api/cards] Gagal mengambil data kartu dari Sanity:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kartu." },
      { status: 500 }
    );
  }
}
