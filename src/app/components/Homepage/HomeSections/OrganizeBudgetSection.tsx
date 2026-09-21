import React, { useMemo } from "react";
import type { BudgetItem } from "@/types/budget";
import Link from "next/link";
import CardCarousel from "@/app/components/shared/CardCarousel";

interface OrganizationCase {
  id: string;
  ministry: string;
}

interface OrganizeBudgetSectionProps {
  cases?: OrganizationCase[];
  dataLabel: string;
  data: BudgetItem[];
  dataValue: string;
  isLoading?: boolean;
}

function filterByMinistry(data: BudgetItem[], ministry: string): BudgetItem[] {
  return data.filter((item) => item.ministry === ministry);
}

function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

const DEFAULT_CASES: OrganizationCase[] = [
  { id: "defense", ministry: "กระทรวงกลาโหม" },
  { id: "education", ministry: "กระทรวงศึกษาธิการ" },
  { id: "interior", ministry: "กระทรวงมหาดไทย" },
];

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

// The whole card is one link to the ministry's organization page. Until the
// budget rows arrive there is no registry id to link to, so the card keeps its
// old search destination.
function caseHref(
  ministry: string,
  ministryId: number | null,
  dataValue: string,
): string {
  return ministryId === null
    ? `/search?q=${encodeURIComponent(ministry)}&budget_source=${dataValue}`
    : `/organizations/${ministryId}?budget_source=${dataValue}`;
}

function CaseCard({
  caseItem,
  dataLabel,
  totalBudget,
  ministryId,
  dataValue,
  isLoading = false,
}: {
  caseItem: OrganizationCase;
  dataLabel: string;
  totalBudget: string;
  ministryId: number | null;
  dataValue: string;
  isLoading?: boolean;
}) {
  return (
    <Link
      href={caseHref(caseItem.ministry, ministryId, dataValue)}
      className="bg-ui-01 flex flex-1 flex-col items-start transition-colors hover:cursor-pointer hover:bg-[#E5E5E5]"
    >
      <div className="flex w-full flex-col gap-[12px] px-[16px] py-[24px]">
        <p className="text-text-01 font-serif text-[20px] leading-[28px] font-bold">
          กลุ่มหน่วยงานที่ได้รับงบประมาณมากที่สุด
        </p>
        <div className="flex flex-col">
          <div className="bg-ui-03 flex items-center justify-center gap-[4px] px-[8px] py-[6px]">
            <p className="text-gray-60 text-[14px] leading-[18px]">ปีงบฯ</p>
            <p className="text-gray-60 text-[14px] leading-[18px] font-semibold">
              {dataLabel}
            </p>
          </div>
          <div className="flex flex-col items-start bg-white p-[8px]">
            <p className="text-text-01 font-serif text-[20px] leading-[28px] font-bold">
              {caseItem.ministry}
            </p>
            {isLoading ? (
              <div className="bg-ui-03 mt-[4px] h-[36px] w-[140px] animate-pulse" />
            ) : (
              <p className="text-text-01 font-serif text-[20px] leading-[36px] font-bold">
                {totalBudget}
              </p>
            )}
            <p className="text-gray-70 text-[12px] leading-[16px]">ล้านบาท</p>
          </div>
        </div>
      </div>
      <div className="border-ui-03 flex w-full items-center justify-center gap-[16px] border-t px-[24px] py-[12px]">
        <span className="text-interactive-01 text-[14px] leading-[18px] font-semibold">
          สำรวจ →
        </span>
      </div>
    </Link>
  );
}

const OrganizeBudgetSection = ({
  cases = DEFAULT_CASES,
  dataLabel,
  data,
  dataValue,
  isLoading = false,
}: OrganizeBudgetSectionProps) => {
  const caseStats = useMemo(() => {
    return cases.map((caseItem) => {
      const filtered = filterByMinistry(data, caseItem.ministry);
      const totalBaht = filtered.reduce((sum, item) => sum + item.amount, 0);
      return {
        id: caseItem.id,
        totalBudget: formatNumber(Math.round(totalBaht / 1_000_000)),
        // Every row of a ministry carries the same registry id, so the first
        // row that has one answers for the whole group.
        ministryId:
          filtered.find((item) => item.ministry_id !== null)?.ministry_id ??
          null,
      };
    });
  }, [cases, data]);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[12px]">
      <div className="bg-ui-05 flex h-[44px] items-center px-[16px] py-[8px]">
        <p className="text-text-04 font-serif text-[20px] leading-[28px] font-bold whitespace-nowrap">
          ค้นหางบฯ ผ่านหน่วยงานที่คุณสนใจ เช่น
        </p>
      </div>
      <CardCarousel label="ค้นหางบฯ ผ่านหน่วยงานที่คุณสนใจ">
        {cases.map((caseItem, index) => {
          const stats = caseStats[index];
          return (
            <CaseCard
              key={caseItem.id}
              caseItem={caseItem}
              dataLabel={dataLabel}
              totalBudget={stats.totalBudget}
              ministryId={stats.ministryId}
              dataValue={dataValue}
              isLoading={isLoading}
            />
          );
        })}
      </CardCarousel>
    </div>
  );
};

export default OrganizeBudgetSection;
