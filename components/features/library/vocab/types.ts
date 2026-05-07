export interface VocabItem {
  _id: string;
  _type?: string;
  word: string;
  furigana?: string;
  romaji?: string;
  meaning: string;
  hinshi?: string;
  mnemonic?: string;
  relatedKanji?: Array<{
    character: string;
    meaning: string;
  }>;
}

export const LEVELS = ["N5", "N4", "N3", "N2"];

export const HINSHI = [
  { label: "Semua Tipe", value: "all" },
  { label: "Kata Benda (Meishi)", value: "noun" },
  { label: "Kata Kerja (Verb)", value: "verb" },
  { label: "Kata Sifat-I (I-Keiyoushi)", value: "i-adjective" },
  { label: "Kata Sifat-Na (Na-Keiyoushi)", value: "na-adjective" },
  { label: "Kata Keterangan (Fukushi)", value: "adverb" },
  { label: "Partikel (Joshi)", value: "particle" },
  { label: "Kata Penghubung (Setsuzokushi)", value: "conjunction" },
  { label: "Kata Ganti (Daimeishi)", value: "pronoun" },
  { label: "Ungkapan (Hyougen)", value: "expression" },
];
