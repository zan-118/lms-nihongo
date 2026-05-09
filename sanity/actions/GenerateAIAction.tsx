import { useState, useCallback } from "react";
import { useDocumentOperation, DocumentActionProps } from "sanity";
import { Sparkles } from "lucide-react";

export const GenerateAIAction = (props: DocumentActionProps) => {
  const { patch } = useDocumentOperation(props.id, props.type);
  const [isGenerating, setIsGenerating] = useState(false);

  const onHandle = useCallback(async () => {
    setIsGenerating(true);

    try {
      // Ambil kata dari draft saat ini
      const draft = props.draft as Record<string, unknown> | null;
      const word = (draft?.word || draft?.character || draft?.masu) as string | undefined;
      
      if (!word) {
        alert("Masukkan kata atau karakter terlebih dahulu sebelum menggunakan AI!");
        setIsGenerating(false);
        return;
      }

      const response = await fetch("/api/sanity-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, type: props.type }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // Patch data ke dokumen
      patch.execute([
        { set: { mnemonic: data.mnemonic } },
        { set: { examples: data.examples } },
      ]);

      alert("✨ Konten berhasil dibuat oleh AI!");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert("❌ Gagal membuat konten: " + errorMessage);
    } finally {
      setIsGenerating(false);
      props.onComplete();
    }
  }, [props, patch]);

  return {
    disabled: isGenerating,
    label: isGenerating ? "Generating..." : "✨ Generate AI Content",
    icon: Sparkles,
    onHandle,
  };
};
