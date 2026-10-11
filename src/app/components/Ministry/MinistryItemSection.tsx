"use client";

import { useState } from "react";
import { DataTableSkeleton } from "@carbon/react";
import type { BudgetItem } from "@/types/budget";
import { matchesAnyKeyword, toTags } from "@/constants/search";
import KeywordSearch from "@/app/components/shared/KeywordSearch";
import KeywordWarning from "./KeywordWarning";
import BudgetListSection from "@/app/components/shared/BudgetListSection";

interface MinistryItemSectionProps {
  items: BudgetItem[];
  year: number;
  version: string;
  docSource: string;
  isLoading: boolean;
  isError: boolean;
}

// The ministry's budget items for the year, all of them until keywords
// narrow the list down. Keywords stay when the year changes.
export default function MinistryItemSection({
  items,
  year,
  version,
  docSource,
  isLoading,
  isError,
}: MinistryItemSectionProps) {
  const [words, setWords] = useState<string[]>([]);
  const tags = toTags(words);
  const shown = words.length
    ? items.filter((item) => matchesAnyKeyword(item, words))
    : items;
  const keywordText = `ที่มีคำว่า '${words.join(", ")}'`;
  // The listed items' total, and its share of all the ministry's items.
  const shownAmount = shown.reduce((sum, item) => sum + item.amount, 0);
  const allAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const share = allAmount > 0 ? (shownAmount / allAmount) * 100 : 0;
  const amountText = `${Math.round(shownAmount / 1_000_000).toLocaleString()} ล้านบาท (${share.toFixed(2)} %)`;
  const subtitle = words.length
    ? `ที่เกี่ยวข้องกับหน่วยงาน และมีคำว่า '${words.join(", ")}'`
    : "ที่เกี่ยวข้องกับหน่วยงาน";

  function addTag(word: string) {
    if (!words.includes(word)) setWords([...words, word]);
  }

  function removeTag(word: string) {
    setWords(words.filter((w) => w !== word));
  }

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex flex-col gap-[8px]">
        <h2 className="font-serif text-[28px] font-bold">รายการงบประมาณ</h2>
        <KeywordSearch
          tags={tags}
          addTag={addTag}
          removeTag={removeTag}
          onLayer
        />
      </div>
      {words.length > 0 && <KeywordWarning />}
      {isLoading ? (
        <DataTableSkeleton
          columnCount={7}
          rowCount={10}
          showHeader={false}
          showToolbar={false}
        />
      ) : isError ? (
        <p className="text-support-01 bg-white px-[16px] py-[24px]">
          โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
        </p>
      ) : shown.length === 0 ? (
        <p className="text-text-02 bg-white px-[16px] py-[24px]">
          {words.length
            ? `ไม่พบรายการ${keywordText}`
            : "ไม่มีรายการงบประมาณในปีนี้"}
        </p>
      ) : (
        // Keyed so new keywords or a new year start from page 1, unsorted.
        <BudgetListSection
          key={`${docSource}|${words.join(",")}`}
          title={null}
          subtitle={subtitle}
          countPrefix="ทั้งหมด"
          amountText={amountText}
          tags={tags}
          data={shown}
          year={year}
          version={version}
        />
      )}
    </div>
  );
}
