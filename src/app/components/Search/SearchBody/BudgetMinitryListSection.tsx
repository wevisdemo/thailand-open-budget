"use client";

import type { BudgetMinistryItem } from "@/types/budget";
import BudgetMinistryListTable from "./BudgetMinitryListTable";
import DownloadIcon from "../../shared/icons/download-icon";
import { useState } from "react";

interface SearchBudgetProportionProps {
  keywords: string[];
  data: BudgetMinistryItem[];
  year: number;
  version: string;
}

export default function BudgetMinistryListSection(
  props: SearchBudgetProportionProps,
) {
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...props.data].sort((a, b) =>
    sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount,
  );

  function handleExportCSV() {
    const headers = [
      "ลำดับ",
      "หน่วยงาน",
      "จำนวนเงิน (บาท)",
      "กระทรวง",
      "สัดส่วนจากงบฯ ที่เกี่ยวข้อง (%)",
    ];
    const rows = sorted.map((item, index) => [
      index + 1,
      item.ministry || "-",
      item.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      item.budgetary || "-",
      item.budgetPercentage.toFixed(2),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ministry_budget_${props.year}_${props.keywords.join("_")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-col justify-between pb-[14px] md:flex-row">
        <div>
          <h2 className="font-serif text-[28px] font-bold">
            หน่วยงานที่ได้รับงบประมาณ
          </h2>
          <p className="text-[16px] font-bold">
            ที่มีคำว่า &apos;{props.keywords.join(", ")}&apos;
          </p>
          <p className="text-text-01 flex flex-wrap">
            <span className="text-blue-70">
              พบทั้งหมด {props.data.length.toLocaleString()} หน่วยงาน
            </span>{" "}
            <span>
              ปีงบฯ {props.year} · {props.version}
            </span>{" "}
            <span className="text-gray-60">
              {sortDir === "desc" ? "เรียงจากมากไปน้อย" : "เรียงจากน้อยไปมาก"}
            </span>
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="text-gray-70 border-gray-20 mt-auto flex h-fit w-fit shrink-0 items-center gap-[8px] border bg-white px-[15px] py-[9px] text-[12px] font-medium hover:cursor-pointer"
        >
          <DownloadIcon color="currentColor" />
          ดาวน์โหลดตารางนี้
        </button>
      </div>
      <div>
        <BudgetMinistryListTable
          data={sorted}
          sortDir={sortDir}
          onSortDirChange={setSortDir}
        />
      </div>
    </div>
  );
}
