"use client";

import { useState } from "react";
import type { Tag } from "@/types/search";
import { TAG_COLORS } from "@/constants/search";

export function useSearchTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [counter, setCounter] = useState(0);

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
