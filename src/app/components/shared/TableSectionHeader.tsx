"use client";

import { Button } from "@carbon/react";
import { Download } from "@carbon/icons-react";

interface TableSectionHeaderProps {
  // Null when the section's heading sits above other content, e.g. a search.
  title: string | null;
  // A bold line under the title, e.g. the search keywords.
  subtitle: string | null;
  // e.g. "พบทั้งหมด 99 หน่วยงาน"
  countText: string;
  year: number;
  version: string;
  // e.g. "เรียงจากมากไปน้อย", from getSortLabel
  sortLabel: string;
  onDownload: () => void;
  downloadDisabled?: boolean;
}

// The title block over a list table: what it holds, how many, which budget
// year and version, how it is sorted, and a CSV download.
export default function TableSectionHeader({
  title,
  subtitle,
  countText,
  year,
  version,
  sortLabel,
  onDownload,
  downloadDisabled = false,
}: TableSectionHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-[16px] pb-[14px] md:flex-row">
      <div>
        {title && <h2 className="font-serif text-[28px] font-bold">{title}</h2>}
        {subtitle && <p className="text-[16px] font-bold">{subtitle}</p>}
        <p className="text-text-01 flex flex-wrap gap-x-[8px]">
          <span className="text-interactive-01">{countText}</span>
          <span>
            ปีงบฯ {year} · {version}
          </span>
          <span className="text-gray-60">{sortLabel}</span>
        </p>
      </div>
      <Button
        kind="ghost"
        size="sm"
        renderIcon={Download}
        onClick={onDownload}
        disabled={downloadDisabled}
        className="text-gray-70 border-gray-20 mt-auto shrink-0 bg-white text-[12px] font-medium"
      >
        ดาวน์โหลดตารางนี้
      </Button>
    </div>
  );
}
