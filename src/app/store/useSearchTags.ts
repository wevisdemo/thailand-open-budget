"use client";

import { useState } from "react";
import type { Tag } from "@/types/search";
import { TAG_COLORS } from "@/constants/search";

export function useSearchTags(initialWords: string[] = []) {
  const [tags, setTags] = useState<Tag[]>(() =>
    initialWords.map((word, i) => ({
      word,
      color: TAG_COLORS[i % TAG_COLORS.length],
    })),
  );
  const [counter, setCounter] = useState(initialWords.length);

  function addTag(word: string) {
    if (word && !tags.find((t) => t.word === word)) {
      const color = TAG_COLORS[counter % TAG_COLORS.length];
      setTags((prev) => [...prev, { word, color }]);
      setCounter((c) => c + 1);
    }
  }

  function removeTag(word: string) {
    setTags((prev) => prev.filter((t) => t.word !== word));
  }

  return { tags, setTags, addTag, removeTag };
}
