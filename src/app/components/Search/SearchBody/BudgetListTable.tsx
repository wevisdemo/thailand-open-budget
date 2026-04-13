"use client";

import { BudgetItem } from "@/types/budget";
import { useState } from "react";
import ArrowsVerticalIcon from "@/app/components/shared/icons/arrows-vertical-icon";
import InformationIcon from "@/app/components/shared/icons/information-icon";

interface BudgetListTableProps {
  data: BudgetItem[];
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

export default function BudgetListTable({
  data,
  keywords,
}: BudgetListTableProps) {
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...data].sort((a, b) =>
    sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount,
  );

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-ui-03 bg-ui-03 border-b-[2px]">
            <th className="px-[16px] py-[12px]"></th>
            <th className="w-[30%] px-[16px] py-[12px] text-left font-semibold">
              รายการ
            </th>
            <th
              className="ml-auto flex justify-end gap-[16px] px-[16px] py-[12px] text-right font-semibold hover:cursor-pointer hover:bg-[#CACACA]"
              onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            >
              จำนวนเงิน
              <ArrowsVerticalIcon />
            </th>
            <th className="px-[16px] py-[12px] text-left font-semibold">
              <span className="flex items-center gap-[8px]">
                โครงการ/ผลผลิต
                <InformationIcon />
              </span>
            </th>
            <th className="px-[16px] py-[12px] text-left font-semibold">
              แผนงาน
            </th>
            <th className="w-[20%] px-[16px] py-[12px] text-left font-semibold">
              หน่วยงาน
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item, index) => (
            <tr
              key={index}
              className="border-ui-03 hover:bg-ui-01 border-b bg-white align-top leading-[18px] transition-colors"
            >
              <td className="text-text-02 px-[16px] py-[12px]">{index + 1}</td>
              <td className="max-w-[280px] px-[16px] py-[12px]">
                <p className="font-bold">
                  {highlightKeywords(item.description, keywords)}
                </p>
                <p className="text-gray-60">หมวดงบประมาณ: {item.category}</p>
              </td>
              <td className="px-[16px] py-[12px] text-right whitespace-nowrap">
                {item.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || "-"}
              </td>
              <td className="px-[16px] py-[12px]">
                {item.project ? highlightKeywords(item.project, keywords) : "-"}
              </td>
              <td className="px-[16px] py-[12px]">
                {item.plan ? highlightKeywords(item.plan, keywords) : "-"}
              </td>
              <td className="px-[16px] py-[12px]">
                <p>{highlightKeywords(item.ministry, keywords)}</p>
                {item.budgetary && (
                  <p className="text-gray-60">{item.budgetary}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
