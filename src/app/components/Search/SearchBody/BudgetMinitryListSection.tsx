"use client";

import type { BudgetMinistryItem } from "@/types/budget";
import BudgetMinistryListTable from "./BudgetMinitryListTable";
import { getSortLabel } from "@/constants/table";
import { downloadCsv } from "@/lib/csv";
import TableSectionHeader from "@/app/components/shared/ui/TableSectionHeader";
import { useState } from "react";

interface BudgetMinistryListSectionProps {
  keywords: string[];
  data: BudgetMinistryItem[];
  year: number;
  version: string;
}

export default function BudgetMinistryListSection(
  props: BudgetMinistryListSectionProps,
) {
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...props.data].sort((a, b) =>
    sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount,
  );

  function handleExportCSV() {
    const headers = [
      "ลำดับ",
      "หน่วยงาน",
      "จำนวนเงิน (บาท)",
      "กระทรวง",
      "สัดส่วนจากงบฯ ที่เกี่ยวข้อง (%)",
    ];
    const rows = sorted.map((item, index) => [
      index + 1,
      item.ministry || "-",
      item.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      item.budgetary || "-",
      item.budgetPercentage.toFixed(2),
    ]);

    downloadCsv(
      headers,
      rows,
      `ministry_budget_${props.year}_${props.keywords.join("_")}.csv`,
    );
  }

  return (
    <div>
      <TableSectionHeader
        title="หน่วยงานที่ได้รับงบประมาณ"
        subtitle={`ที่มีคำว่า '${props.keywords.join(", ")}'`}
        countText={`พบทั้งหมด ${props.data.length.toLocaleString()} หน่วยงาน`}
        year={props.year}
        version={props.version}
        sortLabel={getSortLabel(sortDir)}
        onDownload={handleExportCSV}
      />
      <div>
        <BudgetMinistryListTable
          data={sorted}
          sortDir={sortDir}
          onSortDirChange={setSortDir}
        />
      </div>
    </div>
  );
}
