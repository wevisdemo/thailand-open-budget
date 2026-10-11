"use client";

import type { Tag } from "@/types/search";
import KeywordPanel from "./KeywordPanel";
import KeywordTagList from "./KeywordTagList";

interface KeywordSearchProps {
  tags: Tag[];
  addTag: (word: string) => void;
  removeTag: (word: string) => void;
  onLayer?: boolean;
}

// The keyword input, the chosen keywords, and how they are matched.
export default function KeywordSearch({
  tags,
  addTag,
  removeTag,
  onLayer = false,
}: KeywordSearchProps) {
  return (
    <div className="flex flex-col gap-[8px]">
      <KeywordPanel
        tags={tags}
        addTag={addTag}
        removeTag={removeTag}
        onLayer={onLayer}
      />
      <KeywordTagList tags={tags} removeTag={removeTag} />
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
