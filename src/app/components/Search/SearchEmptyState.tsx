"use client";

import SearchBodySkeleton from "@/app/components/Search/SearchBody/SearchBodySkeleton";
import SearchIcon from "@/app/components/shared/icons/search-icon";
import { EXAMPLE_KEYWORDS } from "@/constants/search";

interface SearchEmptyStateProps {
  onAddTag: (word: string) => void;
}

export default function SearchEmptyState({ onAddTag }: SearchEmptyStateProps) {
  return (
    <div className="relative">
      <div className="flex w-full flex-col items-center justify-center">
        <SearchBodySkeleton />
        <p className="text-text-03 mt-[16px]">
          ข้อมูลรายโครงการจะปรากฏขึ้นเมื่อคุณเริ่มค้นหา
        </p>
      </div>
      <div className="absolute inset-0 flex flex-col items-center gap-[12px] bg-black/40 p-[16px]">
        <SearchIcon color="white" className="mt-[96px] h-[36px] w-[36px]" />
        <p className="mt-[20] font-serif text-[42px] font-bold text-white">
          พิมพ์คีย์เวิร์ดที่สนใจในช่องค้นหาด้านบน
        </p>
        <div className="flex flex-col items-center gap-[12px]">
          <p className="text-[16px] text-white">
            ตัวอย่างคีย์เวิร์ดที่พบได้บ่อยในงบประมาณ
          </p>
          <div className="flex flex-wrap justify-center gap-[8px]">
            {EXAMPLE_KEYWORDS.map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => onAddTag(keyword)}
                className="rounded-full bg-[#CDD3DA] px-[16px] py-[6px] hover:cursor-pointer hover:bg-[#B5BEC7]"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
