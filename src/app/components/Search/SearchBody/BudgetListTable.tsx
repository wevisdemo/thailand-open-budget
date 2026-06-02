"use client";

import type { BudgetItem } from "@/types/budget";
import type { Tag } from "@/types/search";
import { useState } from "react";
import ArrowsVerticalIcon from "@/app/components/shared/icons/arrows-vertical-icon";
import InformationIcon from "@/app/components/shared/icons/information-icon";
import Paginate from "./Paginate";
import ProjectOutputInfoModal from "@/app/components/Search/ProjectOutputInfoModal";

const PAGE_SIZE = 10;

interface BudgetListTableProps {
  data: BudgetItem[];
  tags: Tag[];
  sortDir: "asc" | "desc";
  onSortDirChange: (dir: "asc" | "desc") => void;
}

function highlightTags(text: string, tags: Tag[]): React.ReactNode {
  if (!tags.length) return text;
  const escaped = tags.map((t) =>
    t.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) => {
    const matched = tags.find(
      (t) => t.word.toLowerCase() === part.toLowerCase(),
    );
    return matched ? (
      <span
        key={i}
        style={{ backgroundColor: matched.color }}
        className="font-bold"
      >
        {part}
      </span>
    ) : (
      part
    );
  });
}

export default function BudgetListTable({
  data,
  tags,
  sortDir,
  onSortDirChange,
}: BudgetListTableProps) {
  const [page, setPage] = useState(1);
  const [projectInfoOpen, setProjectInfoOpen] = useState(false);

  const sorted = [...data].sort((a, b) =>
    sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount,
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  // TODO: format table column width
  return (
    <div className="w-full">
      <ProjectOutputInfoModal
        isOpen={projectInfoOpen}
        onClose={() => setProjectInfoOpen(false)}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-[14px]">
          <thead>
            <tr className="border-ui-03 bg-ui-03 border-b-[2px]">
              <th className="px-[16px] py-[8px]" />
              <th className="w-[30%] px-[16px] py-[8px] text-left font-semibold">
                รายการ
              </th>
              <th
                className="px-[16px] py-[8px] text-right font-semibold hover:cursor-pointer hover:bg-[#CACACA]"
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
                <span className="flex items-center gap-[8px]">
                  โครงการ/ผลผลิต
                  <button
                    type="button"
                    onClick={() => setProjectInfoOpen(true)}
                    className="cursor-pointer"
                  >
                    <InformationIcon />
                  </button>
                </span>
              </th>
              <th className="px-[16px] py-[8px] text-left font-semibold">
                แผนงาน
              </th>
              <th className="w-[20%] px-[16px] py-[8px] text-left font-semibold">
                หน่วยงาน
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item, index) => (
              <tr
                key={index}
                className="border-ui-03 hover:bg-ui-01 border-b bg-white align-top leading-[18px] transition-colors"
              >
                <td className="text-text-02 px-[16px] py-[16px]">
                  {startIndex + index + 1}
                </td>
                <td className="max-w-[280px] px-[16px] py-[16px]">
                  <p className="font-bold">
                    {highlightTags(item.description, tags)}
                  </p>
                  <p className="text-gray-60">หมวดงบประมาณ: {item.category}</p>
                </td>
                <td className="px-[16px] py-[16px] text-right whitespace-nowrap">
                  {item.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }) || "-"}
                </td>
                <td className="px-[16px] py-[16px]">
                  {item.project ? highlightTags(item.project, tags) : "-"}
                </td>
                <td className="px-[16px] py-[16px]">
                  {item.plan ? highlightTags(item.plan, tags) : "-"}
                </td>
                <td className="px-[16px] py-[16px]">
                  <p>{item.budgetary}</p>
                  {item.ministry && (
                    <p className="text-gray-60">{item.ministry}</p>
                  )}
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
