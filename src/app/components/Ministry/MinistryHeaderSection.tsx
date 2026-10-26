import type { RelatedDocument } from "@/types/ministry";
import type { OrganizationCoreContent } from "@/types/organization";
import SummaryStatItem from "@/app/components/shared/ui/SummaryStatItem";
import CoreContentTabs from "@/app/components/shared/organization/CoreContentTabs";
import RelatedDocuments from "@/app/components/shared/organization/RelatedDocuments";
import ShareButtons from "@/app/components/shared/organization/ShareButtons";

interface MinistryHeaderSectionProps {
  ministryName: string;
  content: OrganizationCoreContent | null;
  relatedDocuments: RelatedDocument[];
  year: number;
  totalBudget: number;
  unitCount: number;
  itemCount: number;
  isTotalsLoading: boolean;
  isBudgetLoading: boolean;
  // A ministry with no units in the year shows no stats.
  isUnbudgeted: boolean;
}

export default function MinistryHeaderSection({
  ministryName,
  content,
  relatedDocuments,
  year,
  totalBudget,
  unitCount,
  itemCount,
  isTotalsLoading,
  isBudgetLoading,
  isUnbudgeted,
}: MinistryHeaderSectionProps) {
  return (
    <section className="bg-white px-[24px] pt-[24px] pb-[24px] md:pt-[56px]">
      <div className="mx-auto flex w-full max-w-[1128px] flex-col gap-[32px]">
        <h1 className="font-serif text-[42px] font-bold">{ministryName}</h1>
        <div className="flex flex-col gap-[24px] md:flex-row">
          <div className="min-w-0 flex-1">
            {content && <CoreContentTabs content={content} />}
          </div>
          <div className="flex flex-col gap-[16px] md:w-[240px]">
            {relatedDocuments.length > 0 && (
              <RelatedDocuments documents={relatedDocuments} />
            )}
            <ShareButtons title={ministryName} />
          </div>
        </div>
        {!isUnbudgeted && (
          <div className="flex flex-col md:flex-row">
            <SummaryStatItem
              label={`งบประมาณทั้งหมด (ปีงบฯ ${year})`}
              value={
                isTotalsLoading
                  ? "-"
                  : Math.round(totalBudget / 1_000_000).toLocaleString()
              }
              unit="ล้านบาท"
            />
            <SummaryStatItem
              label="จำนวนกรม/หน่วยงานเทียบเท่ากรม"
              value={isTotalsLoading ? "-" : unitCount.toLocaleString()}
              unit="หน่วยงาน"
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
