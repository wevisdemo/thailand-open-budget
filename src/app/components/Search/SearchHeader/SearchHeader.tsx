"use client";

import { useState } from "react";
import SearchPanel from "./SearchPanel";
import SearchHeaderStatItem from "./SearchHeaderStatItem";
import ExclamationIcon from "@/app/components/shared/icons/exclamation-icon";

interface SearchHeaderProps {
  summaryInfo: {
    itemAmount: number;
    totalBudget: number;
    totalDepartment: number;
  };
}

export default function SearchHeader(props: SearchHeaderProps) {
  const [keywords, setKeywords] = useState<string[]>([]);

  return (
    <div className="content-container flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="font-serif text-[28px] font-bold md:text-[42px]">
          สำรวจงบประมาณผ่าน keyword
        </h2>
        <p className="text-blue-70 text-b5">
          คีย์เวิร์ดที่พบได้บ่อย และคำที่น่าสนใจในงบประมาณ
        </p>
        <SearchPanel />
        <p className="text-text-02">
          ใช้ , คั่น เพื่อหาหลายคีย์เวิร์ดพร้อมกัน{" "}
          {keywords.length > 0 && (
            <span className="text-gray-30">
              · `${keywords.length} คำที่เลือก`
            </span>
          )}
        </p>
        <p className="text-blue-70 flex flex-wrap">
          ผลลัพธ์มาจากการแมตช์คีย์เวิร์ดใน 3 คอลัมน์:{" "}
          <span className="font-bold">
            รายการ โครงการ/ผลผลิต และแผนงาน โดยหากพบคำใดคำหนึ่ง
            (กรณีมีหลายคำค้น) ในคอลัมน์ใดคอลัมน์หนึ่ง จะถือว่าเข้าเงื่อนไข
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-[24px] md:gap-[8px]">
        <div className="divide-ui-03 flex flex-col justify-between md:flex-row">
          <SearchHeaderStatItem
            label="จำนวนโครงการ/ผลผลิต"
            value={`${props.summaryInfo.itemAmount.toLocaleString()}+`}
            unit="รายการ"
          />
          <SearchHeaderStatItem
            label="งบประมาณทั้งหมด (ปีงบฯ 2569)"
            value={props.summaryInfo.totalBudget.toLocaleString()}
            unit="ล้านบาท"
          />
          <SearchHeaderStatItem
            label="หน่วยงานที่ได้รับงบประมาณ"
            value={props.summaryInfo.totalDepartment.toLocaleString()}
            unit="หน่วยงาน"
          />
        </div>
        <div className="border-interactive-01 flex gap-[12px] border border-l-[3px] bg-[#eef2ff] px-[8px] py-[16px] md:px-[20px]">
          <ExclamationIcon className="mt-[2px] shrink-0" />
          <p className="text-text-01 text-[14px]">
            <span className="font-bold">ข้อควรระวัง:</span>{" "}
            คีย์เวิร์ดบางคำอาจมีได้มากกว่าหนึ่งความหมาย (เช่น
            เป็นได้ทั้งชื่อสิ่งของหรือชื่อสถานที่)
            จึงควรตรวจสอบบริบทที่ปรากฏคำดังกล่าว ก่อนนำผลลัพธ์ไปใช้หรือสื่อสาร
          </p>
        </div>
      </div>
    </div>
  );
}
