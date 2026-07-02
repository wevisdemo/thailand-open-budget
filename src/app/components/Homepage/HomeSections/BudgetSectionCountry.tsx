import React, { useMemo } from "react";
import type { BudgetItem } from "@/types/budget";

interface BudgetTag {
  label: string;
  variant: "gray" | "cyan" | "green";
}

interface BudgetCase {
  id: string;
  topic: string;
  tags: BudgetTag[];
}

interface BudgetSectionProps {
  cases?: BudgetCase[];
  dataLabel: string;
  data: BudgetItem[];
  dataValue: string;
  isLoading?: boolean;
}

function buildSearchableText(item: BudgetItem): string {
  return [
    item.ministry,
    item.budgetary,
    item.plan,
    item.project,
    item.category,
    item.description,
  ]
    .join(" ")
    .toLowerCase();
}

function filterByTags(data: BudgetItem[], tags: BudgetTag[]): BudgetItem[] {
  const labels = tags.map((t) => t.label.toLowerCase());
  return data.filter((item) => {
    const text = buildSearchableText(item);
    return labels.some((label) => text.includes(label));
  });
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

const DEFAULT_CASES: BudgetCase[] = [
  {
    id: "bangkok",
    topic: "กรุงเทพมหานคร",
    tags: [
      { label: "กรุงเทพมหานคร", variant: "gray" },
      { label: "กทม", variant: "cyan" },
    ],
  },
  {
    id: "buriram",
    topic: "บุรีรัมย์",
    tags: [{ label: "บุรีรัมย์", variant: "gray" }],
  },
  {
    id: "chiangmai",
    topic: "เชียงใหม่",
    tags: [{ label: "เชียงใหม่", variant: "gray" }],
  },
];

const TAG_STYLES: Record<BudgetTag["variant"], string> = {
  gray: "bg-[#cdd3da] text-text-01",
  cyan: "bg-cyan-20 text-cyan-70",
  green: "bg-green-20 text-green-70",
};

function ArrowUpRight() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden
      className="text-interactive-01"
    >
      <path
        d="M4.0625 2.4375V3.25H9.17719L2.4375 9.98969L3.01031 10.5625L9.75 3.82281V8.9375H10.5625V2.4375H4.0625Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CaseCard({
  caseItem,
  dataLabel,
  itemCount,
  totalBudget,
  dataValue,
  isLoading = false,
}: {
  caseItem: BudgetCase;
  dataLabel: string;
  itemCount: string;
  totalBudget: string;
  dataValue: string;
  isLoading?: boolean;
}) {
  return (
    <article className="bg-ui-01 flex flex-1 flex-col items-start">
      <div className="flex w-full flex-col gap-[12px] px-[16px] py-[24px]">
        <p className="text-text-01 font-serif text-[20px] leading-[28px] font-bold">
          งบฯ เกี่ยวกับ &lsquo;{caseItem.topic}&rsquo;
        </p>
        <div className="flex w-full flex-col gap-[16px]">
          <div className="flex flex-col justify-center gap-[4px]">
            <p className="text-text-01 text-[16px] leading-[22px]">
              ตัวอย่างคำค้น
            </p>
            <div className="flex flex-wrap items-center gap-[4px]">
              {caseItem.tags.map((tag) => (
                <span
                  key={tag.label}
                  className={`inline-flex h-[24px] items-center gap-[2px] rounded-full px-[8px] text-[12px] leading-[16px] ${TAG_STYLES[tag.variant]}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <div className="bg-ui-03 flex items-center justify-center gap-[4px] px-[8px] py-[6px]">
              <p className="text-gray-60 text-[14px] leading-[18px]">ปีงบฯ</p>
              <p className="text-gray-60 text-[14px] leading-[18px] font-semibold">
                {dataLabel}
              </p>
            </div>
            <div className="flex bg-white">
              <div className="border-ui-01 flex flex-1 flex-col items-start border-r p-[8px]">
                <p className="text-gray-60 text-[12px] leading-[16px]">
                  จำนวนรายการ
                </p>
                {isLoading ? (
                  <div className="bg-ui-03 h-[28px] w-[100px] animate-pulse" />
                ) : (
                  <p className="text-text-01 font-serif text-[20px] leading-[28px] font-bold">
                    {itemCount}+
                  </p>
                )}

                <p className="text-gray-70 text-[12px] leading-[16px]">
                  รายการ
                </p>
              </div>
              <div className="flex flex-1 flex-col items-start p-[8px]">
                <p className="text-gray-60 text-[12px] leading-[16px]">
                  งบประมาณทั้งหมด
                </p>

                {isLoading ? (
                  <div className="bg-ui-03 h-[28px] w-[100px] animate-pulse" />
                ) : (
                  <p className="text-text-01 font-serif text-[20px] leading-[28px] font-bold">
                    {totalBudget}
                  </p>
                )}

                <p className="text-gray-70 text-[12px] leading-[16px]">
                  ล้านบาท
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a
        href={`/search?q=${encodeURIComponent(caseItem.tags.map((tag) => tag.label).join(","))}&budget_source=${dataValue}`}
        className="border-ui-03 flex w-full items-center justify-center gap-[16px] border bg-white px-[24px] py-[12px]"
      >
        <span className="text-interactive-01 text-[14px] leading-[18px] font-semibold">
          สำรวจ
        </span>
        <ArrowUpRight />
      </a>
    </article>
  );
}

const BudgetSectionCountry = ({
  cases = DEFAULT_CASES,
  dataLabel,
  data,
  dataValue,
  isLoading = false,
}: BudgetSectionProps) => {
  const caseStats = useMemo(() => {
    return cases.map((caseItem) => {
      const filtered = filterByTags(data, caseItem.tags);
      const totalBaht = filtered.reduce((sum, item) => sum + item.amount, 0);
      return {
        id: caseItem.id,
        itemCount: formatNumber(filtered.length),
        totalBudget: formatNumber(Math.round(totalBaht / 1_000_000)),
      };
    });
  }, [cases, data]);

  return (
    <div className="content-container flex w-full flex-col gap-[12px]">
      <div className="bg-ui-05 flex h-[44px] items-center px-[16px] py-[8px]">
        <p className="text-text-04 font-serif text-[20px] leading-[28px] font-bold whitespace-nowrap">
          ค้นหางบฯ ที่เกี่ยวกับจังหวัดของคุณ เช่น
        </p>
      </div>
      <div className="flex snap-x snap-mandatory gap-[12px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:snap-none md:flex-row md:items-stretch md:justify-between md:overflow-visible [&::-webkit-scrollbar]:hidden">
        {cases.map((caseItem, index) => {
          const stats = caseStats[index];
          return (
            <div
              key={caseItem.id}
              className="flex min-w-[280px] flex-1 snap-start md:min-w-0"
            >
              <CaseCard
                caseItem={caseItem}
                dataLabel={dataLabel}
                itemCount={stats.itemCount}
                totalBudget={stats.totalBudget}
                dataValue={dataValue}
                isLoading={isLoading}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetSectionCountry;
