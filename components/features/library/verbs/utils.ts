import { VerbData } from "./types";
import { Sparkles, Volume2, Layers } from "lucide-react";
import React from "react";

export function getBadgeColor(group: number) {
  if (group === 1) return "text-primary text-primary bg-primary/10 border-primary/20";
  if (group === 2) return "text-success text-success bg-success/10 border-success/20";
  return "text-secondary bg-secondary/10 border-secondary/20";
}

export function getGroupAccent(group: number) {
  if (group === 1) return { ring: "ring-primary/30", glow: "shadow-xl", accent: "text-primary text-primary", bg: "bg-primary/10", border: "border-primary/20" };
  if (group === 2) return { ring: "ring-success/30", glow: "shadow-xl", accent: "text-success text-success", bg: "bg-success/10", border: "border-success/20" };
  return { ring: "ring-secondary/30", glow: "shadow-xl", accent: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" };
}

export function getConjugationSections(verb: VerbData) {
  return [
    {
      title: "Bentuk Dasar",
      icon: React.createElement(Sparkles, { size: 14 }),
      items: [
        { label: "Bentuk Masu (Sopan)", value: verb.masu },
        { label: "Bentuk Te (Sambung)", value: verb.te },
        { label: "Bentuk Nai (Negatif)", value: verb.nai },
        { label: "Bentuk Ta (Lampau)", value: verb.ta },
      ],
    },
    {
      title: "Bentuk Ekspresif",
      icon: React.createElement(Volume2, { size: 14 }),
      items: [
        { label: "Ingin (Tai)", value: verb.tai },
        { label: "Potensial (Bisa)", value: verb.kanou },
        { label: "Volisional (Mari)", value: verb.ikou },
        { label: "Kondisional (Jika)", value: verb.katei },
      ],
    },
    {
      title: "Bentuk Lanjut",
      icon: React.createElement(Layers, { size: 14 }),
      items: [
        { label: "Kausatif (Menyuruh)", value: verb.shieki },
        { label: "Pasif (Di-)", value: verb.ukemi },
        { label: "Perintah", value: verb.meirei },
      ],
    },
  ];
}
