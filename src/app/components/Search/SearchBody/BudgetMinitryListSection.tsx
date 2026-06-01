"use client";

import type { BudgetMinistryItem } from "@/types/budget";
import BudgetMinistryListTable from "./BudgetMinitryListTable";
import DownloadIcon from "../../shared/icons/download-icon";

interface SearchBudgetProportionProps {
  keywords: string[];
  data: BudgetMinistryItem[];
  year: number;
  version: string;
}

export default function BudgetMinistryListSection(
  props: SearchBudgetProportionProps,
) {
  return (
    <div>
      <div className="flex flex-col justify-between pb-[14px] md:flex-row">
        <div>
          <h2 className="font-serif text-[28px] font-bold">
            หน่วยงานที่ได้รับงบประมาณ
          </h2>
          <p className="text-[16px] font-bold">
            ที่เกี่ยวข้องกับ &apos;{props.keywords.join(", ")}&apos;
          </p>
          <p className="text-text-01">
            <span className="text-blue-70">
              พบทั้งหมด {props.data.length.toLocaleString()} หน่วยงาน
            </span>{" "}
            <span>
              ปีงบฯ {props.year} · {props.version}
            </span>{" "}
            <span className="text-gray-60">เรียงจากมากไปน้อย</span>
          </p>
        </div>
        <button className="text-gray-70 border-gray-20 mt-auto flex h-fit w-fit shrink-0 items-center gap-[8px] border bg-white px-[15px] py-[9px] text-[12px] font-medium hover:cursor-pointer">
          <DownloadIcon color="currentColor" />
          ดาวน์โหลดตารางนี้
        </button>
      </div>
      <div>
        <BudgetMinistryListTable data={props.data} />
      </div>
    </div>
  );
}
