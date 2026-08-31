"use client";

import { useRef, useState } from "react";
import SearchIcon from "@/app/components/shared/icons/search-icon";
import { withBasePath } from "@/lib/base-path";

interface FuzzySearchPanelProps {
  tags: { word: string }[];
  addTag: (word: string) => void;
  removeTag: (word: string) => void;
  data: string;
}

export default function FuzzySearchPanel({
  tags,
  addTag,
  removeTag,
  data,
}: FuzzySearchPanelProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd(raw: string) {
    const word = raw.trim().replace(/,+$/, "").trim();
    if (word) addTag(word);
    setInput("");
  }

  function handleSearch() {
    const word = input.trim().replace(/,+$/, "").trim();
    const words = [...tags.map((t) => t.word)];
    if (word && !words.includes(word)) words.push(word);
    const q = words.join(",");
    const url = q
      ? `/search?q=${encodeURIComponent(q)}&budget_source=${data}`
      : `/search?budget_source=${data}`;
    // Full-document navigation, NOT router.push. In the static export the App
    // Router client cache keys /search by pathname and restores the previously
    // cached query, so router.push("/search?q=<new>") lands back on the old
    // keyword. A real navigation loads /search fresh with the correct query.
    window.location.href = withBasePath(url);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1].word);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (val.endsWith(",")) {
      handleAdd(val);
    } else {
      setInput(val);
    }
  }

  return (
    <div className="flex items-stretch">
      <div
        className="bg-field-01 border-ui-04 flex min-h-[48px] flex-1 items-center gap-[4px] border-b-[2px] px-[16px] py-[8px] hover:cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <SearchIcon
          color="#525252"
          className="mr-[8px] h-[16px] w-[16px] shrink-0"
        />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="ลองค้นหาด้วย: น้ำท่วม, ไฟป่า, เชียงใหม่..."
          className="text-text-01 placeholder:text-text-03 min-w-[120px] flex-1 bg-transparent text-[14px] focus:outline-none"
        />
      </div>
    </div>
  );
}
