"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Tag } from "@/types/search";
import SearchIcon from "@/app/components/shared/icons/search-icon";

interface SearchPanelProps {
  tags: Tag[];
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
      className="bg-field-01 border-ui-04 flex min-h-[48px] flex-wrap items-center gap-[4px] border-b-[2px] px-[16px] py-[8px] hover:cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <SearchIcon
        color="#525252"
        className="mr-[8px] h-[16px] w-[16px] shrink-0"
      />
      {tags.map((tag) => (
        <span
          key={tag.word}
          style={{ backgroundColor: tag.color }}
          className="flex items-center gap-[6px] rounded-full px-[12px] py-[4px] text-[14px]"
        >
          {tag.word}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(tag.word);
            }}
            className="text-text-02 hover:text-text-01 leading-none hover:cursor-pointer"
            aria-label={`remove ${tag.word}`}
          >
            <Image src="/icons/cross.svg" width={8} height={8} alt="" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? "เพิ่มคำ... (คั่นด้วย ,)" : ""}
        className="text-text-01 placeholder:text-text-03 min-w-[120px] flex-1 bg-transparent text-[14px] focus:outline-none"
      />
    </div>
  );
}
