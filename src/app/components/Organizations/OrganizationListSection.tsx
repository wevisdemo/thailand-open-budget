"use client";

import { useMemo, useState } from "react";
import type {
  OrganizationMinistryGroup,
  OrganizationSort,
  OrganizationSortKey,
  OrganizationYearTotal,
} from "@/types/organization";
import {
  compareByOrganizationSort,
  getChangePercent,
  getNextOrganizationSort,
} from "@/constants/organization";
import { getSortLabel } from "@/constants/table";
import { downloadCsv } from "@/lib/csv";
import SearchIcon from "@/app/components/shared/icons/search-icon";
import TableSectionHeader from "@/app/components/shared/TableSectionHeader";
import Paginate from "@/app/components/shared/Paginate";
import OrganizationTable from "./OrganizationTable";

const PAGE_SIZE = 10;

interface OrganizationListSectionProps {
  groups: OrganizationMinistryGroup[];
  totalBudget: number;
  year: number;
  version: string;
  dataValue: string;
  isLoading: boolean;
  isError: boolean;
}

// Keeps a ministry whose own name matches with all its units, or else only its
// units that match. Also returns the ministries kept for a unit match, which
// open so the match is visible.
function filterGroups(
  groups: OrganizationMinistryGroup[],
  query: string,
): { groups: OrganizationMinistryGroup[]; unitMatchIds: Set<number> } {
  const q = query.trim();
  const unitMatchIds = new Set<number>();
  if (!q) return { groups, unitMatchIds };

  const filtered = groups.flatMap((group) => {
    if (group.ministry_name.includes(q)) return [group];
    const units = group.units.filter((unit) => unit.budgetary_name.includes(q));
    if (units.length === 0) return [];
    unitMatchIds.add(group.ministry_id);
    return [{ ...group, units }];
  });
  return { groups: filtered, unitMatchIds };
}

// Unsorted groups keep their default order, by name ก-ฮ.
function sortGroups(
  groups: OrganizationMinistryGroup[],
  sort: OrganizationSort | null,
): OrganizationMinistryGroup[] {
  if (!sort) return groups;

  const byUnit = compareByOrganizationSort<OrganizationYearTotal>(
    sort,
    (unit) => [unit.budget_amount, unit.previous_year_amount],
  );
  return [...groups]
    .sort(
      compareByOrganizationSort<OrganizationMinistryGroup>(sort, (group) => [
        group.budget_amount,
        group.previous_year_amount,
      ]),
    )
    .map((group) => ({ ...group, units: [...group.units].sort(byUnit) }));
}

function exportCsv(
  groups: OrganizationMinistryGroup[],
  totalBudget: number,
  year: number,
) {
  const headers = [
    "ลำดับ",
    "กระทรวง",
    "หน่วยงาน",
    "จำนวนเงิน (บาท)",
    "% ของงบฯ ประเทศ",
    "การเปลี่ยนแปลง (%) จากปีก่อน",
  ];
  const rows = groups.flatMap((group, index) =>
    group.units.map((unit) => {
      const change = getChangePercent(
        unit.budget_amount,
        unit.previous_year_amount,
      );
      return [
        index + 1,
        group.ministry_name,
        unit.budgetary_name,
        unit.budget_amount,
        ((unit.budget_amount / totalBudget) * 100).toFixed(2),
        change === null ? "" : change.toFixed(2),
      ];
    }),
  );

  downloadCsv(headers, rows, `organization_budget_${year}.csv`);
}

export default function OrganizationListSection({
  groups: allGroups,
  totalBudget,
  year,
  version,
  dataValue,
  isLoading,
  isError,
}: OrganizationListSectionProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<OrganizationSort | null>(null);
  const [page, setPage] = useState(1);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const groups = useMemo(
    () => sortGroups(filterGroups(allGroups, query).groups, sort),
    [allGroups, query, sort],
  );
  const maxAmount = Math.max(...allGroups.map((g) => g.budget_amount), 1);
  const totalPages = Math.max(1, Math.ceil(groups.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;

  // Typing opens the ministries a unit matched in, and closes the rest.
  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
    setExpandedIds(filterGroups(allGroups, value).unitMatchIds);
  }

  function handleSortChange(key: OrganizationSortKey) {
    setSort(getNextOrganizationSort(key, sort));
    setPage(1);
  }

  function handleToggle(ministryId: number) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(ministryId)) next.delete(ministryId);
      else next.add(ministryId);
      return next;
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[1128px] flex-col">
      <TableSectionHeader
        title="หน่วยงานที่ได้รับงบประมาณ"
        subtitle={null}
        countText={`พบทั้งหมด ${groups.length.toLocaleString()} กลุ่มหน่วยงาน`}
        year={year}
        version={version}
        sortLabel={getSortLabel(sort?.dir ?? null)}
        onDownload={() => exportCsv(groups, totalBudget, year)}
        downloadDisabled={isLoading || groups.length === 0}
      />
      <div className="border-ui-04 flex min-h-[48px] items-center gap-[12px] border-b bg-white px-[16px]">
        <SearchIcon color="#525252" className="h-[16px] w-[16px] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="ค้นด้วยชื่อกระทรวง, กรม หรือหน่วยงานเทียบเท่า"
          aria-label="ค้นด้วยชื่อกระทรวง, กรม หรือหน่วยงานเทียบเท่า"
          className="text-text-01 placeholder:text-text-02 flex-1 bg-transparent text-[14px] focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => handleQueryChange("")}
            aria-label="ล้างคำค้น"
            className="text-text-03 text-[18px] leading-none hover:cursor-pointer"
          >
            ×
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="flex flex-col gap-[2px] pt-[2px]">
          {Array.from({ length: PAGE_SIZE }, (_, i) => (
            <div key={i} className="bg-ui-03 h-[72px] animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-support-01 bg-white px-[16px] py-[24px]">
          โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
        </p>
      ) : groups.length === 0 ? (
        <p className="text-text-02 bg-white px-[16px] py-[24px]">
          ไม่พบกระทรวงหรือหน่วยงานที่ตรงกับ &lsquo;{query.trim()}&rsquo;
        </p>
      ) : (
        <>
          <OrganizationTable
            groups={groups.slice(startIndex, startIndex + PAGE_SIZE)}
            startRank={startIndex + 1}
            totalBudget={totalBudget}
            maxAmount={maxAmount}
            expandedIds={expandedIds}
            onToggle={handleToggle}
            sort={sort}
            onSortChange={handleSortChange}
            dataValue={dataValue}
          />
          <Paginate
            page={page}
            totalPages={totalPages}
            totalItems={groups.length}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}
