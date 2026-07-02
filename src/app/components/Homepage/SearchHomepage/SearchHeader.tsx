"use client";

import type { Tag } from "@/types/search";
import SearchPanel from "./SearchPanel";
import TagList from "./TagList";
import SearchCategoriesIcon from "../../shared/icons/search-categories-icon";

interface SearchHeaderProps {
  tags: Tag[];
  addTag: (word: string) => void;
  removeTag: (word: string) => void;
  data: string;
}

export default function SearchHeader({
  tags,
  addTag,
  removeTag,
  data,
}: SearchHeaderProps) {
  return (
    <div className="content-container flex flex-col gap-[8px]">
      <div className="flex flex-col items-start justify-between gap-[8px] md:flex-row md:items-center">
        <div className="flex items-center gap-[8px]">
          <SearchCategoriesIcon color="#161616" colorInner="#F4F4F4" />
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
          รายการ โครงการ/ผลผลิต และแผนงาน โดยหากพบคำใดคำหนึ่ง (กรณีมีหลายคำค้น)
          ในคอลัมน์ใดคอลัมน์หนึ่ง จะถือว่าเข้าเงื่อนไข
        </span>
      </p>
    </div>
  );
}
