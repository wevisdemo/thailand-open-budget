"use client";

import DownloadButton from "./DownloadButton";

interface TableSectionHeaderProps {
  // Null when the section's heading sits above other content, e.g. a search.
  title: string | null;
  // A bold line under the title, e.g. the search keywords.
  subtitle: string | null;
  // e.g. "พบทั้งหมด 99 หน่วยงาน"
  countText: string;
  // An optional total after the count, e.g. "500,000 ล้านบาท 28.59 %".
  amountText?: string;
  year: number;
  version: string;
  // e.g. "เรียงจากมากไปน้อย", from getSortLabel
  sortLabel: string;
  onDownload: () => void;
  downloadDisabled?: boolean;
  // Puts the year, version and sort order on a line of their own under the
  // count and total, instead of after them on the same line.
  stacked?: boolean;
}

// The title block over a list table: what it holds, how many, which budget
// year and version, how it is sorted, and a CSV download.
export default function TableSectionHeader({
  title,
  subtitle,
  countText,
  amountText,
  year,
  version,
  sortLabel,
  onDownload,
  downloadDisabled = false,
  stacked = false,
}: TableSectionHeaderProps) {
  const details = (
    <>
      <span>
        ปีงบฯ {year} · {version}
      </span>
      <span className="text-gray-60">{sortLabel}</span>
    </>
  );
  return (
    <div className="flex flex-col justify-between gap-[16px] pb-[14px] md:flex-row">
      <div>
        {title && <h2 className="font-serif text-[28px] font-bold">{title}</h2>}
        {subtitle && <p className="text-[16px] font-bold">{subtitle}</p>}
        <div className="text-text-01">
          <p className="flex flex-wrap gap-x-[8px]">
            <span className="text-interactive-01">{countText}</span>
            {amountText && <span>{amountText}</span>}
            {!stacked && details}
          </p>
          {stacked && <p className="flex flex-wrap gap-x-[8px]">{details}</p>}
        </div>
      </div>
      <DownloadButton
        text="ดาวน์โหลดตารางนี้"
        onClick={onDownload}
        disabled={downloadDisabled}
        className="mt-auto"
      />
    </div>
  );
}
