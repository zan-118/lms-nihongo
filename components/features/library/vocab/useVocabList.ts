"use client";

import { useState, useEffect, useCallback } from "react";
import * as wanakana from "wanakana";
import { client } from "@/sanity/lib/client";
import { VocabItem } from "./types";

const ITEMS_PER_PAGE = 50;

/**
 * Hook untuk menangani data fetching, filter, dan pagination kosakata dari Sanity.
 */
export function useVocabList(initialData: VocabItem[] = []) {
  const [level, setLevel] = useState("N5");
  const [hinshi, setHinshi] = useState("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [vocabList, setVocabList] = useState<VocabItem[]>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async (page: number) => {
    setLoading(true);
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const baseLevel = level.toLowerCase();
    const kanaSearch = wanakana.toHiragana(debouncedSearch.trim());
    const kataSearch = wanakana.toKatakana(debouncedSearch.trim());

    let filterStr = `(_type == "vocab" || _type == "verb_dictionary") && (course_category->slug.current match $baseLevel + "*" || course_category->slug.current match "jlpt-" + $baseLevel + "*")`;
    if (debouncedSearch.trim() !== "") {
      filterStr += ` && (word match $search + "*" || jisho match $search + "*" || romaji match $search + "*" || meaning match $search + "*" || word match $kana + "*" || jisho match $kana + "*" || furigana match $kana + "*" || word match $kata + "*" || jisho match $kata + "*")`;
    }
    if (hinshi !== "all") {
      if (hinshi === "verb") {
        filterStr += ` && _type == "verb_dictionary"`;
      } else {
        filterStr += ` && _type == "vocab" && hinshi == $hinshi`;
      }
    }

    const queryStr = `{
      "items": *[${filterStr}] | order(coalesce(romaji, "") asc) [$start...$end] { 
        _id, 
        _type,
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

    try {
      const { items, total } = await client.fetch(queryStr, {
        baseLevel,
        search: debouncedSearch.trim(),
        kana: kanaSearch,
        kata: kataSearch,
        hinshi,
        start,
        end,
      });
      setVocabList(items);
      setTotalItems(total);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  }, [level, hinshi, debouncedSearch]);

  const fetchTotalCount = useCallback(async () => {
    const baseLevel = level.toLowerCase();
    const kanaSearch = wanakana.toHiragana(debouncedSearch.trim());
    const kataSearch = wanakana.toKatakana(debouncedSearch.trim());

    let queryStr = `count(*[(_type == "vocab" || _type == "verb_dictionary") && (course_category->slug.current match $baseLevel + "*" || course_category->slug.current match "jlpt-" + $baseLevel + "*")`;
    if (debouncedSearch.trim() !== "") {
      queryStr += ` && (word match $search + "*" || jisho match $search + "*" || romaji match $search + "*" || meaning match $search + "*" || word match $kana + "*" || jisho match $kana + "*" || furigana match $kana + "*" || word match $kata + "*" || jisho match $kata + "*")`;
    }
    if (hinshi !== "all") {
      if (hinshi === "verb") {
        queryStr += ` && _type == "verb_dictionary"`;
      } else {
        queryStr += ` && _type == "vocab" && hinshi == $hinshi`;
      }
    }
    queryStr += `])`;

    try {
      const count = await client.fetch(queryStr, {
        baseLevel,
        search: debouncedSearch.trim(),
        kana: kanaSearch,
        kata: kataSearch,
        hinshi,
      });
      setTotalItems(count);
    } catch (error) {
      console.error("Gagal mengambil count:", error);
    }
  }, [level, hinshi, debouncedSearch]);

  // Handle filter changes
  useEffect(() => {
    const isDefaultFilter = level === "N5" && hinshi === "all" && debouncedSearch === "";
    
    // On first render with default filters, use initial data but fetch count
    if (isDefaultFilter && initialData.length > 0 && totalItems === 0) {
      fetchTotalCount();
      return;
    }

    setCurrentPage(1);
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, hinshi, debouncedSearch]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchData(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    level,
    setLevel,
    hinshi,
    setHinshi,
    search,
    setSearch,
    vocabList,
    totalItems,
    loading,
    currentPage,
    totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
    handlePageChange,
  };
}
