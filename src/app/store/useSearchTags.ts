"use client";

import { useEffect, useRef, useState } from "react";
import type { Tag } from "@/types/search";
import { TAG_COLORS } from "@/constants/search";

function buildTags(words: string[]): Tag[] {
  return words.map((word, i) => ({
    word,
    color: TAG_COLORS[i % TAG_COLORS.length],
  }));
}

export function useSearchTags(initialWords: string[] = []) {
  const [tags, setTags] = useState<Tag[]>(() => buildTags(initialWords));
  const [counter, setCounter] = useState(initialWords.length);

  // In production the App Router Router Cache reuses the page instance, so the
  // `useState` initializer above does not re-run when the URL `q` changes.
  // Re-sync tags whenever the incoming keywords change to avoid a stale search.
  const lastInitialKey = useRef(initialWords.join(","));
  useEffect(() => {
    const key = initialWords.join(",");
    if (key !== lastInitialKey.current) {
      lastInitialKey.current = key;
      setTags(buildTags(initialWords));
      setCounter(initialWords.length);
    }
  }, [initialWords]);

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
