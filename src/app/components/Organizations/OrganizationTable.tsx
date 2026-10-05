"use client";

import Image from "next/image";
import { withBasePath } from "@/lib/base-path";
import type {
  OrganizationMinistryGroup,
  OrganizationSort,
  OrganizationSortKey,
} from "@/types/organization";
import ArrowsVerticalIcon from "@/app/components/shared/icons/arrows-vertical-icon";
import MinistryRows from "./MinistryRows";

interface OrganizationTableProps {
  groups: OrganizationMinistryGroup[];
  // Rank of the first row on this page, so ranks run on across pages.
  startRank: number;
  // The year's grand total, which each row's share is taken over.
  totalBudget: number;
  // The largest ministry's amount, which fills a share bar.
  maxAmount: number;
  expandedIds: Set<number>;
  onToggle: (ministryId: number) => void;
  sort: OrganizationSort | null;
  onSortChange: (key: OrganizationSortKey) => void;
  dataValue: string;
}

interface SortHeaderProps {
  label: React.ReactNode;
  sortKey: OrganizationSortKey;
  sort: OrganizationSort | null;
  onSortChange: (key: OrganizationSortKey) => void;
  widthClassName: string;
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSortChange,
  widthClassName,
}: SortHeaderProps) {
  const isActive = sort?.key === sortKey;
  return (
    <th
      className={`${widthClassName} px-[16px] py-[8px] text-right font-semibold hover:cursor-pointer hover:bg-[#CACACA]`}
      onClick={() => onSortChange(sortKey)}
      aria-sort={
        isActive ? (sort.dir === "desc" ? "descending" : "ascending") : "none"
      }
    >
      <span className="flex items-center justify-between gap-[8px] text-left">
        {label}
        {isActive ? (
          <Image
            src={withBasePath("/icons/arrow-down.svg")}
            alt=""
            width={16}
            height={16}
            className={`shrink-0 ${sort.dir === "desc" ? "rotate-180" : ""}`}
          />
        ) : (
          <ArrowsVerticalIcon className="shrink-0" />
        )}
      </span>
    </th>
  );
}

export default function OrganizationTable({
  groups,
  startRank,
  totalBudget,
  maxAmount,
  expandedIds,
  onToggle,
  sort,
  onSortChange,
  dataValue,
}: OrganizationTableProps) {
  return (
    <div className="mx-[-24px] overflow-x-auto px-[24px] md:mx-0 md:px-[0px]">
      <table className="w-full min-w-[800px] table-fixed border-collapse text-[14px]">
        <thead>
          <tr className="bg-ui-03">
            <th className="w-[5%] py-[8px]" />
            <th className="w-[5%] py-[8px]" />
            <th className="w-[38%] px-[16px] py-[8px] text-left font-semibold">
              หน่วยงาน
            </th>
            <SortHeader
              label="จำนวนเงิน"
              sortKey="amount"
              sort={sort}
              onSortChange={onSortChange}
              widthClassName="w-[18%]"
            />
            <th className="w-[18%] px-[16px] py-[8px] text-center font-semibold">
              % ของงบฯ ประเทศ
            </th>
            <SortHeader
              label={
                <>
                  การเปลี่ยนแปลง
                  <br />
                  (%) จากปีก่อน
                </>
              }
              sortKey="change"
              sort={sort}
              onSortChange={onSortChange}
              widthClassName="w-[16%]"
            />
          </tr>
        </thead>
        <tbody>
          {groups.map((group, index) => (
            <MinistryRows
              key={group.ministry_id}
              group={group}
              rank={startRank + index}
              isExpanded={expandedIds.has(group.ministry_id)}
              onToggle={onToggle}
              totalBudget={totalBudget}
              maxAmount={maxAmount}
              dataValue={dataValue}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
