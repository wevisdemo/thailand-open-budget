"use client";

import type { Tag } from "@/types/search";
import SearchPanel from "./SearchPanel";

interface SearchHeaderProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
}

export default function SearchHeader(props: SearchHeaderProps) {
  return (
    <div className="content-container flex flex-col gap-[8px]">
      <h2 className="font-serif text-[28px] font-bold md:text-[42px]">
        สำรวจงบประมาณผ่าน keyword
      </h2>
      <p className="text-blue-70 text-b5">
        คีย์เวิร์ดที่พบได้บ่อย และคำที่น่าสนใจในงบประมาณ
      </p>
      <SearchPanel tags={props.tags} onTagsChange={props.onTagsChange} />
      <p className="text-text-02">
        ใช้ , คั่น เพื่อหาหลายคีย์เวิร์ดพร้อมกัน{" "}
        {props.tags.length > 0 && (
          <span className="text-gray-30">
            · {`${props.tags.length} คำที่เลือก`}
          </span>
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
