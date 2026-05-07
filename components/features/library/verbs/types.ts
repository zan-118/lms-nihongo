export interface VerbData {
  _id: string;
  group: number;
  jisho: string;
  meaning: string;
  masu: string;
  furigana?: string;
  te?: string;
  nai?: string;
  ta?: string;
  tai?: string;
  kanou?: string;
  shieki?: string;
  ukemi?: string;
  katei?: string;
  ikou?: string;
  meirei?: string;
  transitivity?: string;
  mnemonic?: string;
  relatedKanji?: string[];
}
