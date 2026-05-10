"use client";

import { useRef, useState } from "react";
import SearchIcon from "@/app/components/shared/icons/search-icon";

interface SearchPanelProps {
  tags: { word: string }[];
  addTag: (word: string) => void;
  removeTag: (word: string) => void;
}

export default function SearchPanel({
  tags,
  addTag,
  removeTag,
}: SearchPanelProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleAdd(raw: string) {
    const word = raw.trim().replace(/,+$/, "").trim();
    if (word) addTag(word);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd(input);
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
    <div
      className="bg-field-01 border-ui-04 flex min-h-[48px] items-center gap-[4px] border-b-[2px] px-[16px] py-[8px] hover:cursor-text"
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
        placeholder="เพิ่มคำ... (คั่นด้วย ,)"
        className="text-text-01 placeholder:text-text-03 min-w-[120px] flex-1 bg-transparent text-[14px] focus:outline-none"
      />
    </div>
  );
}
