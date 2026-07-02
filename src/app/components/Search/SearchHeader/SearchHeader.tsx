"use client";

import type { Tag } from "@/types/search";
import SearchPanel from "./SearchPanel";
import TagList from "./TagList";

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
      <SearchPanel tags={tags} addTag={addTag} removeTag={removeTag} />
      <TagList tags={tags} removeTag={removeTag} />
      <p className="text-text-02">
        ใช้ , คั่น เพื่อหาหลายคีย์เวิร์ดพร้อมกัน{" "}
        {tags.length > 0 && (
          <span className="text-gray-30">· {`${tags.length} คำที่เลือก`}</span>
        )}
      </p>
      <p className="text-blue-70 flex flex-wrap">
        ผลลัพธ์มาจากการแมตช์คีย์เวิร์ดที่ค้นหา ใน 3 คอลัมน์:{" "}
        <span className="font-bold">
          (รายการ, โครงการ/ผลผลิต, แผนงาน)
          โดยจะแสดงผลหากพบคำที่ตรงกันในคอลัมน์ใดคอลัมน์หนึ่ง
        </span>
      </p>
    </div>
  );
}
