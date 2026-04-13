"use client";

import { useState } from "react";
import DownloadIcon from "../../shared/icons/download-icon";
import SearchLineChart from "./SearchLineChart";

const mockTrendData = [
  { year: 2567, value: 2800, isCurrent: false },
  { year: 2568, value: 4200, isCurrent: false },
  { year: 2569, value: 5300, isCurrent: true },
];

type BudgetUnit = "million" | "percent";

interface SearchBudgetTrendProps {
  keywords: string[];
  filteredBudget: number;
  totalBudget: number;
}

export default function SearchBudgetTrend(props: SearchBudgetTrendProps) {
  const [unit, setUnit] = useState<BudgetUnit>("million");

  return (
    <div className="flex w-full flex-col gap-[16px] bg-white px-[16px] py-[24px] md:px-[24px]">
      <div className="flex flex-col gap-[16px]">
        <div>
          <h2 className="font-serif text-[28px] font-bold">
            ความเปลี่ยนแปลงงบประมาณ
          </h2>
          <div className="flex flex-col justify-between md:flex-row md:items-end">
            <div className="shrink-1">
              <p className="text-[16px] font-bold">
                ที่เกี่ยวข้องกับ &apos;{props.keywords.join(", ")}&apos;
              </p>
              <p className="text-text-01">ปีงบฯ 2569 · ฉบับร่าง</p>
            </div>
            <button className="text-gray-70 border-gray-20 flex h-fit w-fit shrink-0 items-center gap-[8px] border px-[15px] py-[9px] font-medium hover:cursor-pointer">
              <DownloadIcon color="currentColor" />
              ดาวน์โหลดข้อมูลส่วนนี้
            </button>
          </div>
        </div>
        <hr className="border-ui-03 w-full border-t-[1px]" />
        <div className="flex w-fit">
          <button
            onClick={() => setUnit("million")}
            className={`rounded-l-[4px] px-[16px] py-[8px] hover:cursor-pointer ${
              unit === "million"
                ? "bg-interactive-01 text-inverse-01"
                : "border-ui-04 bg-ui-02 text-text-02 border"
            }`}
          >
            ล้านบาท
          </button>
          <button
            onClick={() => setUnit("percent")}
            className={`rounded-r-[4px] px-[16px] py-[8px] hover:cursor-pointer ${
              unit === "percent"
                ? "bg-interactive-01 text-inverse-01"
                : "border-ui-04 bg-ui-02 text-text-02 border"
            }`}
          >
            ร้อยละ (%)
          </button>
        </div>
        <SearchLineChart data={mockTrendData} />
      </div>
    </div>
  );
}
