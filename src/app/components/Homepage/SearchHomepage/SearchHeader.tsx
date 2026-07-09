"use client";

import type { Tag } from "@/types/search";
import SearchPanel from "./SearchPanel";
import TagList from "./TagList";
import SearchCategoriesIcon from "../../shared/icons/search-categories-icon";

interface SearchHeaderProps {
  tags: Tag[];
  addTag: (word: string) => void;
  removeTag: (word: string) => void;
  onClearTags: () => void;
  data: string;
}

export default function SearchHeader({
  tags,
  addTag,
  removeTag,
  onClearTags,
  data,
}: SearchHeaderProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[8px]">
      <div className="mb-[16px] flex flex-col items-start justify-between gap-[8px] md:flex-row md:items-center">
        <div className="flex gap-[8px] md:items-center">
          <SearchCategoriesIcon
            color="#161616"
            colorInner="#F4F4F4"
            className="mt-2 md:mt-0"
          />
          <h2 className="text-text-01 font-serif text-[28px] font-bold text-balance md:text-[42px]">
            สำรวจงบประมาณผ่านคีย์เวิร์ด
          </h2>
        </div>
        <p className="text-b4 text-text-01">
          ค้นหางบประมาณจากประเด็นที่สนใจ
          <br />
          หรืองบประมาณเกี่ยวกับจังหวัดของคุณ
        </p>
      </div>

      <SearchPanel
        tags={tags}
        addTag={addTag}
        removeTag={removeTag}
        onClearTags={onClearTags}
        data={data}
      />
      <TagList tags={tags} removeTag={removeTag} />
      <p className="text-text-02">
        ใช้ , คั่น เพื่อหาหลายคีย์เวิร์ดพร้อมกัน{" "}
        {tags.length > 0 && (
          <span className="text-gray-30">· {`${tags.length} คำที่เลือก`}</span>
        )}
      </p>
      <p className="text-blue-70 flex flex-wrap">
        ผลลัพธ์มาจากการแมตช์คีย์เวิร์ดใน 3 คอลัมน์:{" "}
        <span className="font-bold">
          (รายการ, โครงการ/ผลผลิต, แผนงาน)
          โดยจะแสดงผลหากพบคำที่ตรงกันในคอลัมน์ใดคอลัมน์หนึ่ง
        </span>
      </p>
    </div>
  );
}
