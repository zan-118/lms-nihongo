"use server";

import { sanityFetch } from "@/lib/sanity.fetch";
import * as wanakana from "wanakana";

export interface KanjiListItem {
  _id: string;
  character: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  jlpt: string;
  slug: string;
}

export interface PaginatedKanjiResponse {
  data: KanjiListItem[];
  total: number;
}

export async function getPaginatedKanji(
  page: number = 1,
  limit: number = 24,
  search: string = "",
  level: string = ""
): Promise<PaginatedKanjiResponse> {
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const exactLevel = level ? level.toUpperCase() : "";
  const searchFilter = search ? `&& (character match $searchQuery || meaning match $searchQuery || $search in onyomi || $search in kunyomi)` : "";
  const levelFilter = level ? `&& jlptLevel == $exactLevel` : "";

  const query = `{
    "data": *[_type == "kanji" ${searchFilter} ${levelFilter}] | order(jlptLevel asc, character asc) [$start...$end] {
      _id,
      character,
      meaning,
      onyomi,
      kunyomi,
      "jlpt": jlptLevel,
      "slug": coalesce(slug.current, character)
    },
    "total": count(*[_type == "kanji" ${searchFilter} ${levelFilter}])
  }`;

  const response = await sanityFetch<PaginatedKanjiResponse>({
    query,
    params: { 
      start, 
      end, 
      searchQuery: `*${search}*`,
      search: search,
      exactLevel: exactLevel
    },
    tags: ["kanji"],
  });

  return response;
}

export interface PaginatedVocabResponse {
  data: any[];
  total: number;
}

export async function getPaginatedVocab(
  page: number = 1,
  limit: number = 50,
  search: string = "",
  level: string = "N5",
  hinshi: string = "all"
): Promise<PaginatedVocabResponse> {
  const start = (page - 1) * limit;
  const end = start + limit;
  const exactLevel = level.toUpperCase();
  
  const searchTrim = search.trim();
  const kanaSearch = wanakana.toHiragana(searchTrim);
  const kataSearch = wanakana.toKatakana(searchTrim);

  let filterStr = `(_type == "vocab" || _type == "verb_dictionary") && jlptLevel == $exactLevel`;
  if (searchTrim !== "") {
    filterStr += ` && (word match $searchQuery || jisho match $searchQuery || romaji match $searchQuery || meaning match $searchQuery || word match $kanaQuery || jisho match $kanaQuery || furigana match $kanaQuery || word match $kataQuery || jisho match $kataQuery)`;
  }
  if (hinshi !== "all") {
    if (hinshi === "verb") {
      filterStr += ` && _type == "verb_dictionary"`;
    } else {
      filterStr += ` && _type == "vocab" && hinshi == $hinshi`;
    }
  }

  const query = `{
    "data": *[${filterStr}] | order(coalesce(romaji, "") asc) [$start...$end] { 
      _id, 
      _type,
      "slug": coalesce(slug.current, word, jisho, _id),
      "word": coalesce(word, jisho), 
      furigana, 
      romaji, 
      meaning, 
      "hinshi": coalesce(hinshi, "verb"),
      mnemonic,
      "relatedKanji": relatedKanji[]->{ character, meaning }
    },
    "total": count(*[${filterStr}])
  }`;

  const response = await sanityFetch<PaginatedVocabResponse>({
    query,
    params: { 
      start, 
      end, 
      searchQuery: `*${searchTrim}*`,
      kanaQuery: `*${kanaSearch}*`,
      kataQuery: `*${kataSearch}*`,
      exactLevel,
      hinshi
    },
    tags: ["vocab", "verb_dictionary"],
  });

  return response;
}

export interface ReadingListMaterial {
  title: string;
  difficulty: string;
  slug: string;
  category?: string;
}

export interface PaginatedReadingResponse {
  data: ReadingListMaterial[];
  total: number;
}

export async function getPaginatedReading(
  page: number = 1,
  limit: number = 9,
  search: string = ""
): Promise<PaginatedReadingResponse> {
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const searchFilter = search ? `&& (title match $searchQuery || category->title match $searchQuery)` : "";

  const query = `{
    "data": *[_type == "readingMaterial" ${searchFilter}] | order(_createdAt desc) [$start...$end] {
      title,
      difficulty,
      "slug": slug.current,
      "category": category->title
    },
    "total": count(*[_type == "readingMaterial" ${searchFilter}])
  }`;

  const response = await sanityFetch<PaginatedReadingResponse>({
    query,
    params: { 
      start, 
      end, 
      searchQuery: `*${search}*`
    },
    tags: ["reading_material"],
  });

  return response;
}

export interface ListeningTaskItem {
  _id: string;
  title: string;
  slug: string;
}

export interface PaginatedListeningResponse {
  data: ListeningTaskItem[];
  total: number;
}

export async function getPaginatedListening(
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<PaginatedListeningResponse> {
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const searchFilter = search ? `&& (title match $searchQuery)` : "";

  const query = `{
    "data": *[_type == "listeningTask" ${searchFilter}] | order(_createdAt desc) [$start...$end] {
      _id,
      title,
      "slug": slug.current
    },
    "total": count(*[_type == "listeningTask" ${searchFilter}])
  }`;

  const response = await sanityFetch<PaginatedListeningResponse>({
    query,
    params: { 
      start, 
      end, 
      searchQuery: `*${search}*`
    },
    tags: ["listening_task"],
  });

  return response;
}
