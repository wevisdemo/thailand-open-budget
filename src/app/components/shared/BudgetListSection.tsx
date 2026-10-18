"use client";

import BudgetListTable from "./BudgetListTable";
import type { BudgetItem, BudgetSort, BudgetSortKey } from "@/types/budget";
import type { Tag } from "@/types/search";
import { useState } from "react";
import { getNextSort, sortBudgetItems } from "@/constants/budget";
import { getSortLabel } from "@/constants/table";
import { downloadCsv } from "@/lib/csv";
import TableSectionHeader from "@/app/components/shared/TableSectionHeader";

interface BudgetListSectionProps {
  title: string | null;
  subtitle: string | null;
  // Words before the item count; the search page says "พบทั้งหมด".
  countPrefix?: string;
  // An optional total after the count, e.g. "500,000 ล้านบาท (28.59 %)".
  amountText?: string;
  // The order the table opens in; by default the budget document's.
  defaultSort?: BudgetSort | null;
  // Unset, the table lists each item's หน่วยงาน.
  showOrganization?: boolean;
  tags: Tag[];
  data: BudgetItem[];
  year: number;
  version: string;
  // Shown in the table body when there are no rows.
  emptyState?: React.ReactNode;
}

export default function BudgetListSection(props: BudgetListSectionProps) {
  const [sort, setSort] = useState<BudgetSort | null>(
    props.defaultSort ?? null,
  );

  function handleSortChange(key: BudgetSortKey) {
    setSort(getNextSort(key, sort));
  }

  function handleExportCSV() {
    const headers = [
      "ลำดับ",
      "รายการ",
      "หมวดงบประมาณ",
      "จำนวนเงิน (บาท)",
      "โครงการ/ผลผลิต",
      "แผนงาน",
      "หน่วยงาน",
      "กระทรวง",
    ];
    const sorted = sortBudgetItems(props.data, sort);
    const rows = sorted.map((item, index) => [
      index + 1,
      item.description,
      item.category,
      item.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) || "-",
      item.project || item.output || "-",
      item.plan || "-",
      item.budgetary,
      item.ministry,
    ]);

    downloadCsv(
      headers,
      rows,
      `budget_${props.year}_${props.tags.map((t) => t.word).join("_")}.csv`,
    );
  }

  return (
    <div>
      <TableSectionHeader
        title={props.title}
        subtitle={props.subtitle}
        countText={`${props.countPrefix ?? "พบทั้งหมด"} ${props.data.length.toLocaleString()} รายการ`}
        amountText={props.amountText}
        year={props.year}
        version={props.version}
        sortLabel={getSortLabel(sort?.dir ?? null, {
          isText: sort?.key !== "amount",
          unsortedLabel: "เรียงตามลำดับในเอกสาร",
        })}
        onDownload={handleExportCSV}
        downloadDisabled={props.data.length === 0}
      />
      <div>
        <BudgetListTable
          tags={props.tags}
          data={props.data}
          sort={sort}
          onSortChange={handleSortChange}
          showOrganization={props.showOrganization}
          emptyState={props.emptyState}
        />
      </div>
    </div>
  );
}
