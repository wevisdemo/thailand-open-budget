"use client";

import type { BudgetMinistryItem } from "@/types/budget";
import { useState } from "react";
import ArrowsVerticalIcon from "@/app/components/shared/icons/arrows-vertical-icon";
import Paginate from "./Paginate";

const PAGE_SIZE = 10;

interface BudgetMinistryListTableProps {
  data: BudgetMinistryItem[];
  sortDir: "asc" | "desc";
  onSortDirChange: (dir: "asc" | "desc") => void;
}

export default function BudgetMinistryListTable({
  data,
  sortDir,
  onSortDirChange,
}: BudgetMinistryListTableProps) {
  const [page, setPage] = useState(1);

  const sorted = data;

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="w-full">
      <div className="mx-[-24px] overflow-x-auto px-[24px] md:mx-0 md:px-[0px]">
        <table className="w-full min-w-[800px] table-fixed border-collapse text-[14px]">
          <thead>
            <tr className="border-ui-03 bg-ui-03 border-b-[2px]">
              <th className="w-[6%] px-[16px] py-[8px]" />
              <th className="w-[30%] px-[16px] py-[8px] text-left font-semibold">
                หน่วยงาน
              </th>
              <th
                className="w-[21%] px-[16px] py-[8px] text-right font-semibold hover:cursor-pointer hover:bg-[#CACACA]"
                onClick={() =>
                  onSortDirChange(sortDir === "desc" ? "asc" : "desc")
                }
              >
                <span className="flex items-center justify-end gap-[8px]">
                  จำนวนเงิน
                  <ArrowsVerticalIcon />
                </span>
              </th>
              <th className="w-[18%] px-[16px] py-[8px] text-left font-semibold">
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
                  {item.ministry || "-"}
                </td>
                <td className="px-[16px] py-[16px] text-right whitespace-nowrap">
                  {item.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-[16px] py-[16px]">{item.budgetary || "-"}</td>
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
                      {item.budgetPercentage.toFixed(2)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
