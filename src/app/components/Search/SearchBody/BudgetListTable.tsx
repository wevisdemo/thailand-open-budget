"use client";

import type { BudgetItem, BudgetSort, BudgetSortKey } from "@/types/budget";
import type { Tag } from "@/types/search";
import { useMemo, useState } from "react";
import InformationIcon from "@/app/components/shared/icons/information-icon";
import PdfIcon from "@/app/components/shared/icons/pdf-icon";
import { getObligedYearRange, sortBudgetItems } from "@/constants/budget";
import SortableHeader from "./SortableHeader";
import Paginate from "./Paginate";
import ProjectOutputInfoModal from "@/app/components/Search/ProjectOutputInfoModal";

const PAGE_SIZE = 10;

interface BudgetListTableProps {
  data: BudgetItem[];
  tags: Tag[];
  sort: BudgetSort | null;
  onSortChange: (key: BudgetSortKey) => void;
}

function formatBaht(amount: number): string {
  return amount.toLocaleString(undefined, { maximumFractionDigits: 0 });
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
  sort,
  onSortChange,
}: BudgetListTableProps) {
  const [page, setPage] = useState(1);
  const [projectInfoOpen, setProjectInfoOpen] = useState(false);

  // Thai collation over a long result list is not free, and paging re-renders.
  const sorted = useMemo(() => sortBudgetItems(data, sort), [data, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageItems = sorted.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="w-full">
      <ProjectOutputInfoModal
        isOpen={projectInfoOpen}
        onClose={() => setProjectInfoOpen(false)}
      />
      <div className="mx-[-24px] overflow-x-auto px-[24px] md:mx-0 md:px-[0px]">
        <table className="w-full min-w-[1000px] table-fixed border-collapse text-[14px]">
          <thead>
            <tr className="border-ui-03 bg-ui-03 border-b-[2px]">
              <th className="w-[5%] px-[16px] py-[8px]" />
              <th className="w-[22%] px-[16px] py-[8px] text-left font-semibold">
                รายการ
              </th>
              <SortableHeader
                label="จำนวนเงิน"
                widthClassName="w-[16%]"
                align="right"
                sortKey="amount"
                sort={sort}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="โครงการ/ผลผลิต"
                widthClassName="w-[14%]"
                sortKey="project"
                sort={sort}
                onSortChange={onSortChange}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProjectInfoOpen(true);
                  }}
                  className="shrink-0 cursor-pointer"
                >
                  <InformationIcon />
                </button>
              </SortableHeader>
              <SortableHeader
                label="แผนงาน"
                widthClassName="w-[12%]"
                sortKey="plan"
                sort={sort}
                onSortChange={onSortChange}
              />
              <SortableHeader
                label="ประเภทงบ"
                widthClassName="w-[11%]"
                sortKey="category"
                sort={sort}
                onSortChange={onSortChange}
              />
              <th className="w-[13%] px-[16px] py-[8px] text-left font-semibold">
                หน่วยงาน
              </th>
              <th className="w-[7%] px-[16px] py-[8px] text-center font-semibold">
                อ้างอิง
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item, index) => {
              const obligedYearRange = getObligedYearRange(
                item.fiscal_year_list,
              );
              return (
                <tr
                  key={index}
                  className="border-ui-03 hover:bg-ui-01 border-b bg-white align-top leading-[18px] transition-colors"
                >
                  <td className="text-text-02 px-[16px] py-[16px]">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-[16px] py-[16px]">
                    <p className="font-bold">
                      {highlightTags(item.description, tags)}
                    </p>
                    {obligedYearRange && (
                      <p className="text-blue-50">
                        งบผูกพัน ({obligedYearRange})
                      </p>
                    )}
                  </td>
                  <td className="px-[16px] py-[16px] text-right whitespace-nowrap">
                    <p>{formatBaht(item.amount)}</p>
                    {obligedYearRange && (
                      <p className="text-blue-50">
                        รวมทุกปี
                        <br />
                        {formatBaht(item.total_fiscal_amount)}
                      </p>
                    )}
                  </td>
                  <td className="px-[16px] py-[16px]">
                    {item.project
                      ? highlightTags(item.project, tags)
                      : item.output
                        ? highlightTags(item.output, tags)
                        : "-"}
                  </td>
                  <td className="px-[16px] py-[16px]">
                    {item.plan_prefix || item.plan_suffix ? (
                      <>
                        {item.plan_prefix && <p>{item.plan_prefix}</p>}
                        {item.plan_suffix && (
                          <p className="text-gray-60">{item.plan_suffix}</p>
                        )}
                      </>
                    ) : (
                      item.plan || "-"
                    )}
                  </td>
                  <td className="px-[16px] py-[16px]">
                    {item.category || "-"}
                  </td>
                  <td className="px-[16px] py-[16px]">
                    <p>{item.budgetary}</p>
                    {item.ministry && (
                      <p className="text-gray-60">{item.ministry}</p>
                    )}
                  </td>
                  <td className="px-[16px] py-[16px] text-center">
                    {item.page_url ? (
                      <a
                        href={item.page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="เปิดเอกสารงบประมาณหน้าที่อ้างอิง"
                        className="inline-flex"
                      >
                        <PdfIcon className="h-[16px] w-[16px] shrink-0" />
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              );
            })}
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
