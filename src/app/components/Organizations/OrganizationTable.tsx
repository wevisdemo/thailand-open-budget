"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  OrganizationMinistryGroup,
  OrganizationSort,
  OrganizationSortKey,
} from "@/types/organization";
import { getChangePercent } from "@/constants/organization";
import ArrowsVerticalIcon from "@/app/components/shared/icons/arrows-vertical-icon";
import DownAngleIcon from "@/app/components/shared/icons/down-angle-icon";

const UNIT_PAGE_SIZE = 10;

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
  sort: OrganizationSort;
  onSortChange: (key: OrganizationSortKey) => void;
  dataValue: string;
}

interface MinistryRowsProps {
  group: OrganizationMinistryGroup;
  rank: number;
  isExpanded: boolean;
  onToggle: (ministryId: number) => void;
  totalBudget: number;
  maxAmount: number;
  dataValue: string;
}

interface SortHeaderProps {
  label: React.ReactNode;
  sortKey: OrganizationSortKey;
  sort: OrganizationSort;
  onSortChange: (key: OrganizationSortKey) => void;
  widthClassName: string;
}

interface ShareBarProps {
  percent: number;
  // Bar length, 0-100. Scaled to the largest ministry rather than the whole
  // budget, since no row comes near 100%.
  fill: number;
}

interface ChangeBadgeProps {
  amount: number;
  previousAmount: number | null;
}

interface AmountCellsProps {
  amount: number;
  previousAmount: number | null;
  totalBudget: number;
  maxAmount: number;
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSortChange,
  widthClassName,
}: SortHeaderProps) {
  const isActive = sort.key === sortKey;
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
        <ArrowsVerticalIcon className="shrink-0" />
      </span>
    </th>
  );
}

function ShareBar({ percent, fill }: ShareBarProps) {
  return (
    <div className="flex items-center justify-center gap-[12px]">
      <div className="h-[4px] w-[80px]">
        <div
          className="bg-interactive-01 h-[4px]"
          style={{ width: `${Math.min(fill, 100)}%` }}
        />
      </div>
      <span className="w-[48px]">{percent.toFixed(1)}%</span>
    </div>
  );
}

function ChangeBadge({ amount, previousAmount }: ChangeBadgeProps) {
  const percent = getChangePercent(amount, previousAmount);
  const rounded = percent === null ? null : Number(percent.toFixed(1));

  if (rounded === null || rounded === 0) {
    return (
      <span className="bg-ui-03 text-text-01 inline-flex rounded-full px-[8px] py-[2px]">
        {rounded === null ? "ไม่พบข้อมูล" : "เท่าเดิม"}
      </span>
    );
  }
  return (
    <span
      className={`text-text-01 inline-flex items-center gap-[4px] rounded-full px-[8px] py-[2px] ${rounded > 0 ? "bg-green-30" : "bg-red-30"}`}
    >
      <span aria-hidden className="text-[10px]">
        {rounded > 0 ? "▲" : "▼"}
      </span>
      <span className="sr-only">{rounded > 0 ? "เพิ่มขึ้น" : "ลดลง"}</span>
      {Math.abs(rounded).toFixed(1)}%
    </span>
  );
}

function AmountCells({
  amount,
  previousAmount,
  totalBudget,
  maxAmount,
}: AmountCellsProps) {
  return (
    <>
      <td className="px-[16px] py-[16px] text-right whitespace-nowrap">
        {amount.toLocaleString("en-US")}
      </td>
      <td className="px-[16px] py-[16px]">
        <ShareBar
          percent={(amount / totalBudget) * 100}
          fill={(amount / maxAmount) * 100}
        />
      </td>
      <td className="px-[16px] py-[16px] text-right">
        <ChangeBadge amount={amount} previousAmount={previousAmount} />
      </td>
    </>
  );
}

// One ministry's row, and under it, while expanded, its units a page at a
// time: a ministry can hold thousands (องค์กรปกครองส่วนท้องถิ่น has ~2,850).
function MinistryRows({
  group,
  rank,
  isExpanded,
  onToggle,
  totalBudget,
  maxAmount,
  dataValue,
}: MinistryRowsProps) {
  const [visibleCount, setVisibleCount] = useState(UNIT_PAGE_SIZE);
  const remaining = group.units.length - visibleCount;

  return (
    <>
      <tr className="border-ui-03 border-b bg-white align-top leading-[18px]">
        <td className="py-[16px] text-center">
          <button
            type="button"
            onClick={() => onToggle(group.ministry_id)}
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? "ซ่อน" : "แสดง"}หน่วยงานใน${group.ministry_name}`}
            className="hover:cursor-pointer"
          >
            <DownAngleIcon
              className={`transition-transform ${isExpanded ? "" : "-rotate-90"}`}
            />
          </button>
        </td>
        <td className="py-[16px] text-center">{rank}</td>
        <td className="px-[16px] py-[16px]">
          <Link
            href={`/organizations/${group.ministry_id}?budget_source=${dataValue}`}
            className="text-text-01 underline"
          >
            {group.ministry_name}
          </Link>
          <p className="text-text-03 mt-[4px]">
            มี {group.units.length.toLocaleString()} หน่วยงาน
          </p>
        </td>
        <AmountCells
          amount={group.budget_amount}
          previousAmount={group.previous_year_amount}
          totalBudget={totalBudget}
          maxAmount={maxAmount}
        />
      </tr>
      {isExpanded &&
        group.units.slice(0, visibleCount).map((unit) => (
          <tr
            key={unit.budgetary_id}
            className="border-ui-03 bg-ui-01 border-b align-top leading-[18px]"
          >
            <td />
            <td />
            <td className="px-[16px] py-[16px]">
              <Link
                href={`/organizations/${unit.ministry_id}/${unit.budgetary_id}?budget_source=${dataValue}`}
                className="text-text-01 underline"
              >
                {unit.budgetary_name}
              </Link>
            </td>
            <AmountCells
              amount={unit.budget_amount}
              previousAmount={unit.previous_year_amount}
              totalBudget={totalBudget}
              maxAmount={maxAmount}
            />
          </tr>
        ))}
      {isExpanded && remaining > 0 && (
        <tr className="border-ui-03 bg-ui-01 border-b">
          <td />
          <td />
          <td colSpan={4} className="px-[16px] py-[12px]">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + UNIT_PAGE_SIZE)}
              className="text-interactive-01 text-[14px] font-semibold hover:cursor-pointer"
            >
              แสดงเพิ่ม (เหลืออีก {remaining.toLocaleString()} หน่วยงาน)
            </button>
          </td>
        </tr>
      )}
    </>
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
