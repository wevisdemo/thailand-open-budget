"use client";

import BudgetListTable from "./BudgetListTable";
import type { BudgetItem } from "@/types/budget";
import type { Tag } from "@/types/search";
import { useState } from "react";
import DownloadIcon from "../../shared/icons/download-icon";

interface BudgetListSectionProps {
  tags: Tag[];
  data: BudgetItem[];
  year: number;
  version: string;
}

export default function BudgetListSection(props: BudgetListSectionProps) {
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  return (
    <div>
      <div className="flex flex-col justify-between pb-[14px] md:flex-row">
        <div>
          <h2 className="font-serif text-[28px] font-bold">รายการงบประมาณ</h2>
          <p className="text-[16px] font-bold">
            ที่เกี่ยวข้องกับ &apos;{props.tags.map((t) => t.word).join(", ")}
            &apos;
          </p>
          <p className="text-text-01">
            <span className="text-blue-70">
              พบทั้งหมด {props.data.length.toLocaleString()} รายการ
            </span>{" "}
            <span>
              ปีงบฯ {props.year} · {props.version}
            </span>{" "}
            <span className="text-gray-60">
              {sortDir === "desc" ? "เรียงจากมากไปน้อย" : "เรียงจากน้อยไปมาก"}
            </span>
          </p>
        </div>
        <button className="text-gray-70 border-gray-20 mt-auto flex h-fit w-fit shrink-0 items-center gap-[8px] border bg-white px-[15px] py-[9px] text-[12px] font-medium hover:cursor-pointer">
          <DownloadIcon color="currentColor" />
          ดาวน์โหลดตารางนี้
        </button>
      </div>
      <div>
        <BudgetListTable
          tags={props.tags}
          data={props.data}
          sortDir={sortDir}
          onSortDirChange={setSortDir}
        />
      </div>
    </div>
  );
}
