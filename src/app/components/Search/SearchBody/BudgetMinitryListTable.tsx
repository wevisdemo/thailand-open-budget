"use client";

import type { BudgetMinistryItem } from "@/types/budget";
import { useState } from "react";
import ArrowsVerticalIcon from "@/app/components/shared/icons/arrows-vertical-icon";
import Paginate from "./Paginate";

const PAGE_SIZE = 10;

interface BudgetMinistryListTableProps {
  data: BudgetMinistryItem[];
  keywords: string[];
}

function highlightKeywords(text: string, keywords: string[]): React.ReactNode {
  if (!keywords.length) return text;
  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-interactive-01 font-bold">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function BudgetMinistryListTable({
  data,
  keywords,
}: BudgetMinistryListTableProps) {
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const sorted = [...data].sort((a, b) =>
    sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount,
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="w-full">
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-ui-03 bg-ui-03 border-b-[2px]">
            <th className="px-[16px] py-[8px]" />
            <th className="w-[30%] px-[16px] py-[8px] text-left font-semibold">
              หน่วยงาน
            </th>
            <th
              className="px-[16px] py-[8px] text-right font-semibold hover:cursor-pointer hover:bg-[#CACACA]"
              onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            >
              <span className="flex items-center justify-end gap-[8px]">
                จำนวนเงิน
                <ArrowsVerticalIcon />
              </span>
            </th>
            <th className="w-[20%] px-[16px] py-[8px] text-left font-semibold">
              กระทรวง
            </th>
            <th className="w-[25%] px-[16px] py-[8px] text-left font-semibold">
              สัดส่วนจากงบฯ ที่เกี่ยวข้อง
            </th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((item, index) => (
            <tr
              key={item.id}
              className="border-ui-03 hover:bg-ui-01 border-b bg-white align-middle leading-[18px] transition-colors"
            >
              <td className="text-text-02 px-[16px] py-[16px]">
                {startIndex + index + 1}
              </td>
              <td className="px-[16px] py-[16px] font-bold">
                {highlightKeywords(item.ministry, keywords)}
              </td>
              <td className="px-[16px] py-[16px] text-right whitespace-nowrap">
                {item.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="px-[16px] py-[16px]">
                {highlightKeywords(item.budgetary, keywords)}
              </td>
              <td className="px-[16px] py-[16px]">
                <div className="flex items-center gap-[8px]">
                  <div className="h-[4px] flex-1 bg-[#E0E0E0]">
                    <div
                      className="bg-interactive-01 h-[4px]"
                      style={{
                        width: `${Math.min(item.budgetPercentage, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="w-[40px] text-right text-[12px]">
                    {item.budgetPercentage.toFixed(1)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Paginate
        page={page}
        totalPages={totalPages}
        totalItems={sorted.length}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </div>
  );
}
