"use client";

import { useState, useMemo } from "react";
import * as wanakana from "wanakana";
import { VerbData } from "./types";

const ITEMS_PER_PAGE = 30;

/**
 * Hook untuk menangani logika pencarian, filter kategori, dan paginasi kata kerja.
 */
export function useVerbFilter(initialVerbs: VerbData[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredVerbs = useMemo(() => {
    return initialVerbs.filter((verb) => {
      const s = searchTerm.toLowerCase().trim();
      if (s === "") return activeGroup ? verb.group === activeGroup : true;

      const kanaSearch = wanakana.toHiragana(s);
      const matchesSearch =
        verb.jisho.toLowerCase().includes(s) ||
        verb.meaning.toLowerCase().includes(s) ||
        verb.masu.toLowerCase().includes(s) ||
        verb.jisho.includes(kanaSearch) ||
        (verb.furigana && verb.furigana.includes(kanaSearch));
      
      const matchesGroup = activeGroup ? verb.group === activeGroup : true;
      return matchesSearch && matchesGroup;
    });
  }, [initialVerbs, searchTerm, activeGroup]);

  const totalPages = Math.ceil(filteredVerbs.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVerbs = filteredVerbs.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleGroupChange = (group: number | null) => {
    setActiveGroup(group);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    searchTerm,
    handleSearchChange,
    activeGroup,
    handleGroupChange,
    currentPage,
    handlePageChange,
    totalPages,
    filteredVerbs,
    paginatedVerbs,
  };
}
