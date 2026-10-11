"use client";

import { useState, type ReactNode } from "react";
import { Button, ContentSwitcher, Switch } from "@carbon/react";
import { Download } from "@carbon/icons-react";
import LineChart from "./LineChart";
import type { BudgetYearTotal } from "@/types/budget";
import { downloadCsv } from "@/lib/csv";

type BudgetUnit = "million" | "percent";

const UNITS: { value: BudgetUnit; label: string }[] = [
  { value: "million", label: "ล้านบาท" },
  { value: "percent", label: "ร้อยละ (%)" },
];

interface BudgetTrendCardProps {
  // The line under the title naming what is measured, e.g. a ministry.
  subtitle: string;
  yearTotals: BudgetYearTotal[];
  version: string;
  // A control to change what the percentages are of, beside the unit switch
  // while it shows ร้อยละ.
  baseSelect?: ReactNode;
}

export default function BudgetTrendCard({
  subtitle,
  yearTotals,
  version,
  baseSelect,
}: BudgetTrendCardProps) {
  const [unit, setUnit] = useState<BudgetUnit>("million");

  function handleDownload() {
    const rows = [...yearTotals]
      .sort((a, b) => a.year - b.year)
      .map((t) => {
        const percentage =
          t.totalBudgetBaht > 0
            ? (t.totalSelectedBaht / t.totalBudgetBaht) * 100
            : 0;
        return [
          t.year,
          t.totalSelectedBaht.toLocaleString("en-US"),
          `${percentage.toFixed(2)}%`,
        ];
      });
    downloadCsv(
      ["year", "totalbudget", "percentage(%)"],
      rows,
      "budget-trend.csv",
    );
  }

  const years = yearTotals.map((t) => t.year);
  const firstYear = Math.min(...years);
  const lastYear = Math.max(...years);

  const trendData = yearTotals.map(
    ({ year, totalSelectedBaht: totalBaht, totalBudgetBaht, isCurrent }) => ({
      year,
      isCurrent,
      value:
        unit === "million"
          ? totalBaht / 1_000_000
          : totalBudgetBaht > 0
            ? (totalBaht / totalBudgetBaht) * 100
            : 0,
    }),
  );

  return (
    <div className="flex w-full flex-col gap-[16px] bg-white px-[16px] py-[24px] md:px-[24px]">
      <div className="flex flex-col gap-[16px]">
        <div>
          <h2 className="font-serif text-[28px] font-bold">
            ความเปลี่ยนแปลงงบประมาณ
          </h2>
          <div className="flex flex-col justify-between md:flex-row md:items-end">
            <div className="shrink-1">
              <p className="text-[16px] font-bold">{subtitle}</p>
              <p className="text-text-01">
                ปีงบฯ {firstYear}–{lastYear} · {version}
              </p>
            </div>
            <Button
              kind="ghost"
              size="sm"
              renderIcon={Download}
              onClick={handleDownload}
              className="text-gray-70 border-gray-20 shrink-0 bg-white text-[12px] font-medium"
            >
              ดาวน์โหลดข้อมูลส่วนนี้
            </Button>
          </div>
        </div>
        <hr className="border-ui-03 w-full border-t-[1px]" />
        {/* The selected switch takes the brand blue, as in the design,
            instead of Carbon's dark grey, and each switch fits its label
            rather than truncating to an even share of the width. */}
        <div className="flex flex-col gap-[16px] md:flex-row md:items-center md:justify-between">
          <ContentSwitcher
            selectedIndex={UNITS.findIndex((u) => u.value === unit)}
            onChange={({ index }) => setUnit(UNITS[index ?? 0].value)}
            size="sm"
            className="w-fit [--cds-layer-selected-inverse:var(--color-interactive-01)] [&_.cds--content-switcher-btn]:w-auto [&_.cds--content-switcher-btn]:shrink-0 [&_.cds--content-switcher-btn]:px-[24px]"
          >
            {UNITS.map(({ value, label }) => (
              <Switch key={value} name={value} text={label} />
            ))}
          </ContentSwitcher>
          {unit === "percent" && baseSelect}
        </div>
        {trendData.length > 0 && <LineChart data={trendData} unit={unit} />}
      </div>
    </div>
  );
}
