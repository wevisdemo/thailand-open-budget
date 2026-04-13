"use client";

import { useState } from "react";

import SearchIcon from "@/app/components/shared/icons/search-icon";

export default function SearchPanel() {
  const [query, setQuery] = useState<string>("");

  return (
    <div className="bg-field-01 border-ui-04 flex items-center gap-[8px] border-b-[2px] px-[16px] py-[12px]">
      <SearchIcon color="#525252" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="เพิ่มคำ... (คั่นด้วย ,)"
        className="text-text-01 placeholder:text-text-03 flex-1 bg-transparent text-[14px] focus:outline-none"
      />
    </div>
  );
}
