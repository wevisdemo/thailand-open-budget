"use client";

import { useState } from "react";
import DownloadIcon from "../../shared/icons/download-icon";
import SearchLineChart from "./SearchLineChart";
import type { BudgetYearTotal } from "@/types/budget";

type BudgetUnit = "million" | "percent";

interface SearchBudgetTrendProps {
  keywords: string[];
  yearTotals: BudgetYearTotal[];
  version: string;
}

export default function SearchBudgetTrend({
  keywords,
  yearTotals,
  version,
}: SearchBudgetTrendProps) {
  const [unit, setUnit] = useState<BudgetUnit>("million");

  function handleDownload() {
    const rows = [
      "year,totalbudget",
      ...yearTotals
        .slice()
        .sort((a, b) => a.year - b.year)
        .map(
          (t) => `${t.year},"${t.totalSelectedBaht.toLocaleString("en-US")}"`,
        ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "budget-trend.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const trendData = yearTotals.map(
    ({ year, totalSelectedBaht: totalBaht, totalBudgetBaht, isCurrent }) => ({
      year,
      isCurrent,
      value:
        unit === "million"
          ? totalBaht / 1_000_000
          : totalBudgetBaht > 0
            ? (totalBaht / totalBudgetBaht) * 100
            : 0,
    }),
  );

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
                ที่มีคำว่า &apos;{keywords.join(", ")}&apos;
              </p>
              <p className="text-text-01">
                ปีงบฯ{" "}
                {yearTotals
                  .map((t) => t.year)
                  .sort((a, b) => a - b)
                  .join("–")}{" "}
                · {version}
              </p>
            </div>
            <button
              onClick={handleDownload}
              className="text-gray-70 border-gray-20 flex h-fit w-fit shrink-0 items-center gap-[8px] border px-[15px] py-[9px] text-[12px] font-medium hover:cursor-pointer"
            >
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
        {trendData.length > 0 && (
          <SearchLineChart data={trendData} unit={unit} />
        )}
      </div>
    </div>
  );
}
