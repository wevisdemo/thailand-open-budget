"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DataTableSkeleton,
  Pagination,
  Search,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import type {
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
import ShareBar from "@/app/components/shared/ShareBar";
import ChangeBadge from "@/app/components/shared/ChangeBadge";
import TableSectionHeader from "@/app/components/shared/TableSectionHeader";

const PAGE_SIZE = 10;

// The design opens on the biggest units first.
const DEFAULT_SORT: OrganizationSort = { key: "amount", dir: "desc" };

interface MinistryUnitSectionProps {
  ministryId: number;
  units: OrganizationYearTotal[];
  countryBudget: number;
  year: number;
  version: string;
  dataValue: string;
  isLoading: boolean;
  isError: boolean;
}

// Unsorted units read by name, ก-ฮ.
function sortUnits(
  units: OrganizationYearTotal[],
  sort: OrganizationSort | null,
): OrganizationYearTotal[] {
  if (!sort) {
    return [...units].sort((a, b) =>
      a.budgetary_name.localeCompare(b.budgetary_name, "th"),
    );
  }
  return [...units].sort(
    compareByOrganizationSort<OrganizationYearTotal>(sort, (unit) => [
      unit.budget_amount,
      unit.previous_year_amount,
    ]),
  );
}

function getSortDirection(
  key: OrganizationSortKey,
  sort: OrganizationSort | null,
): "ASC" | "DESC" | "NONE" {
  if (sort?.key !== key) return "NONE";
  return sort.dir === "asc" ? "ASC" : "DESC";
}

function exportCsv(
  units: OrganizationYearTotal[],
  countryBudget: number,
  ministryId: number,
  year: number,
) {
  const headers = [
    "ลำดับ",
    "หน่วยงาน",
    "จำนวนเงิน (บาท)",
    "% ของงบฯ ประเทศ",
    "การเปลี่ยนแปลง (%) จากปีก่อน",
  ];
  const rows = units.map((unit, index) => {
    const change = getChangePercent(
      unit.budget_amount,
      unit.previous_year_amount,
    );
    return [
      index + 1,
      unit.budgetary_name,
      unit.budget_amount,
      ((unit.budget_amount / countryBudget) * 100).toFixed(2),
      change === null ? "" : change.toFixed(2),
    ];
  });

  downloadCsv(headers, rows, `ministry_${ministryId}_units_${year}.csv`);
}

export default function MinistryUnitSection({
  ministryId,
  units: allUnits,
  countryBudget,
  year,
  version,
  dataValue,
  isLoading,
  isError,
}: MinistryUnitSectionProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<OrganizationSort | null>(DEFAULT_SORT);
  const [page, setPage] = useState(1);

  const units = useMemo(() => {
    const q = query.trim();
    const filtered = q
      ? allUnits.filter((unit) => unit.budgetary_name.includes(q))
      : allUnits;
    return sortUnits(filtered, sort);
  }, [allUnits, query, sort]);
  // Bars are scaled to the ministry's largest unit, filtered or not, so a
  // unit's bar keeps its length while the list is searched.
  const maxAmount = Math.max(...allUnits.map((u) => u.budget_amount), 1);
  const startIndex = (page - 1) * PAGE_SIZE;

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  function handleSortChange(key: OrganizationSortKey) {
    setSort(getNextOrganizationSort(key, sort));
    setPage(1);
  }

  return (
    <div className="flex flex-col">
      <TableSectionHeader
        title="กรมหรือหน่วยงานเทียบเท่า"
        subtitle={null}
        countText={`พบทั้งหมด ${units.length.toLocaleString()} หน่วยงาน`}
        year={year}
        version={version}
        sortLabel={getSortLabel(sort?.dir ?? null)}
        onDownload={() => exportCsv(units, countryBudget, ministryId, year)}
        downloadDisabled={isLoading || units.length === 0}
      />
      <Search
        size="lg"
        labelText="ค้นด้วยชื่อหน่วยงาน"
        placeholder="ค้นด้วยชื่อหน่วยงาน"
        closeButtonLabelText="ล้างคำค้น"
        value={query}
        onChange={(event) => handleQueryChange(event.target.value)}
        className="[&_.cds--search-input]:bg-white"
      />
      {isLoading ? (
        <DataTableSkeleton
          columnCount={4}
          rowCount={PAGE_SIZE}
          showHeader={false}
          showToolbar={false}
        />
      ) : isError ? (
        <p className="text-support-01 bg-white px-[16px] py-[24px]">
          โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
        </p>
      ) : units.length === 0 ? (
        <p className="text-text-02 bg-white px-[16px] py-[24px]">
          {query.trim()
            ? `ไม่พบหน่วยงานที่ตรงกับ ‘${query.trim()}’`
            : "ไม่มีหน่วยงานที่ได้รับงบประมาณในปีนี้"}
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            {/* The design shows the ↑↓ icon on unsorted columns too, not only
                on hover, and cells in the primary text colour. The number
                columns keep fixed widths so the table doesn't shift as rows
                are sorted, searched or paged. */}
            <Table className="[&_td]:text-text-01 [&_.cds--table-sort\_\_icon-unsorted]:opacity-100">
              <TableHead>
                <TableRow>
                  <TableHeader>หน่วยงาน</TableHeader>
                  <TableHeader
                    isSortable
                    className="w-[180px]"
                    isSortHeader={sort?.key === "amount"}
                    sortDirection={getSortDirection("amount", sort)}
                    onClick={() => handleSortChange("amount")}
                  >
                    จำนวนเงิน
                  </TableHeader>
                  <TableHeader className="w-[180px]">
                    % ของงบฯ ประเทศ
                  </TableHeader>
                  <TableHeader
                    isSortable
                    className="w-[200px]"
                    isSortHeader={sort?.key === "change"}
                    sortDirection={getSortDirection("change", sort)}
                    onClick={() => handleSortChange("change")}
                  >
                    การเปลี่ยนแปลง (%) จากปีก่อน
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {units.slice(startIndex, startIndex + PAGE_SIZE).map((unit) => (
                  <TableRow key={unit.budgetary_id}>
                    <TableCell>
                      <Link
                        href={`/organizations/${unit.ministry_id}/${unit.budgetary_id}?budget_source=${dataValue}`}
                        className="text-text-01 underline"
                      >
                        {unit.budgetary_name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {unit.budget_amount.toLocaleString("en-US")}
                    </TableCell>
                    <TableCell>
                      <ShareBar
                        percent={(unit.budget_amount / countryBudget) * 100}
                        fill={(unit.budget_amount / maxAmount) * 100}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <ChangeBadge
                        amount={unit.budget_amount}
                        previousAmount={unit.previous_year_amount}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* The design has no page-size picker: hide Carbon's, keep the
              range, the page select and the arrows. */}
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            pageSizes={[PAGE_SIZE]}
            totalItems={units.length}
            onChange={({ page: next }) => setPage(next)}
            itemRangeText={(min, max, total) =>
              `${min} – ${max} จาก ${total.toLocaleString()} รายการ`
            }
            pageRangeText={(_current, total) => `จาก ${total} หน้า`}
            backwardText="หน้าก่อนหน้า"
            forwardText="หน้าถัดไป"
            pageNumberText="หมายเลขหน้า"
            className="[&_.cds--pagination\_\_left>label]:hidden [&_.cds--select\_\_item-count]:hidden"
          />
        </>
      )}
    </div>
  );
}
