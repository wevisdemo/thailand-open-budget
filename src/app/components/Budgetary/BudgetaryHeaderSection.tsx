import Link from "next/link";
import { ArrowLeft } from "@carbon/icons-react";
import type { RelatedDocument } from "@/types/ministry";
import type { OrganizationCoreContent } from "@/types/organization";
import SummaryStatItem from "@/app/components/shared/SummaryStatItem";
import CoreContentTabs from "@/app/components/shared/CoreContentTabs";
import RelatedDocuments from "@/app/components/shared/RelatedDocuments";
import ShareButtons from "@/app/components/shared/ShareButtons";

interface BudgetaryHeaderSectionProps {
  ministryName: string;
  ministryHref: string;
  budgetaryName: string;
  content: OrganizationCoreContent | null;
  relatedDocuments: RelatedDocument[];
  year: number;
  totalBudget: number | null;
  itemCount: number;
  isTotalsLoading: boolean;
  isBudgetLoading: boolean;
  // A unit with no budget in the year shows no stats.
  isUnbudgeted: boolean;
}

export default function BudgetaryHeaderSection({
  ministryName,
  ministryHref,
  budgetaryName,
  content,
  relatedDocuments,
  year,
  totalBudget,
  itemCount,
  isTotalsLoading,
  isBudgetLoading,
  isUnbudgeted,
}: BudgetaryHeaderSectionProps) {
  return (
    <section className="bg-white px-[24px] pt-[24px] pb-[24px] md:pt-[56px]">
      <div className="mx-auto flex w-full max-w-[1128px] flex-col gap-[32px]">
        <div className="flex flex-col gap-[8px]">
          <Link
            href={ministryHref}
            className="text-text-01! flex w-fit items-center gap-[8px] font-serif text-[18px] font-bold no-underline! hover:underline!"
          >
            <ArrowLeft size={16} className="shrink-0" />
            {ministryName}
          </Link>
          <h1 className="font-serif text-[28px] font-bold md:text-[42px]">
            {budgetaryName}
          </h1>
        </div>
        <div className="flex flex-col gap-[24px] md:flex-row">
          <div className="min-w-0 flex-1">
            {content && <CoreContentTabs content={content} />}
          </div>
          <div className="flex flex-col gap-[16px] md:w-[240px]">
            {relatedDocuments.length > 0 && (
              <RelatedDocuments documents={relatedDocuments} />
            )}
            <ShareButtons title={budgetaryName} />
          </div>
        </div>
        {!isUnbudgeted && (
          <div className="flex flex-col md:flex-row">
            <SummaryStatItem
              label={`งบประมาณทั้งหมด (ปีงบฯ ${year})`}
              value={
                isTotalsLoading || totalBudget === null
                  ? "-"
                  : Math.round(totalBudget / 1_000_000).toLocaleString()
              }
              unit="ล้านบาท"
            />
            <SummaryStatItem
              label="จำนวนรายการ"
              value={isBudgetLoading ? "-" : itemCount.toLocaleString()}
              unit="รายการ"
            />
          </div>
        )}
      </div>
    </section>
  );
}
