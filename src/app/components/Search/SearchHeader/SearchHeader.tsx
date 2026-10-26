"use client";

import type { Tag } from "@/types/search";
import KeywordSearch from "@/app/components/shared/budget-list/KeywordSearch";

interface SearchHeaderProps {
  tags: Tag[];
  addTag: (word: string) => void;
  removeTag: (word: string) => void;
}

export default function SearchHeader({
  tags,
  addTag,
  removeTag,
}: SearchHeaderProps) {
  return (
    <div className="content-container flex flex-col gap-[8px]">
      <h2 className="font-serif text-[28px] font-bold md:text-[42px]">
        สำรวจงบประมาณผ่านคีย์เวิร์ด
      </h2>
      <KeywordSearch tags={tags} addTag={addTag} removeTag={removeTag} />
    </div>
  );
}
