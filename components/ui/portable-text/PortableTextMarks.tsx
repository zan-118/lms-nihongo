import React from "react";
import { PortableTextMarkComponent } from "@portabletext/react";
import VocabTrigger from "@/components/features/reading/components/VocabTrigger";
import FuriganaDisplay from "@/components/ui/FuriganaDisplay";
import { useReading } from "@/components/features/reading/components/ReadingContext";

const FuriganaWrapper = ({ children, reading }: { children: React.ReactNode; reading: string }) => {
  const { mode } = useReading();
  return (
    <FuriganaDisplay 
      text={String(children)} 
      furigana={reading} 
      size="medium" 
      mode={mode}
      className="inline-flex !gap-x-0 !gap-y-0"
    />
  );
};

export const ptMarks: Record<string, PortableTextMarkComponent<any>> = {
  vocabRef: ({ children, value }: { children: React.ReactNode; value?: any }) => {
    return (
      <VocabTrigger text={String(children)} vocabId={value?.reference?._ref}>
        {children}
      </VocabTrigger>
    );
  },
  furigana: ({ children, value }: { children: React.ReactNode; value?: any }) => {
    return <FuriganaWrapper reading={value?.reading || ""}>{children}</FuriganaWrapper>;
  },
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-black text-foreground border-b-2 border-primary/20">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-primary/80">{children}</em>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-mono text-sm border border-primary/20">
      {children}
    </code>
  ),
};
