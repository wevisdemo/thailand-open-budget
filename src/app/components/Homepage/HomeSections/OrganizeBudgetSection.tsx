import type { OrganizationHighlight } from "@/types/organization";
import OrganizationHighlightCarousel from "@/app/components/shared/OrganizationHighlightCarousel";

interface OrganizeBudgetSectionProps {
  dataLabel: string;
  highlights: OrganizationHighlight[];
  isLoading?: boolean;
}

export default function OrganizeBudgetSection({
  dataLabel,
  highlights,
  isLoading = false,
}: OrganizeBudgetSectionProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[12px]">
      <div className="bg-ui-05 flex h-[44px] items-center px-[16px] py-[8px]">
        <p className="text-text-04 font-serif text-[20px] leading-[28px] font-bold whitespace-nowrap">
          ค้นหางบฯ ผ่านหน่วยงานที่คุณสนใจ เช่น
        </p>
      </div>
      <OrganizationHighlightCarousel
        label="ค้นหางบฯ ผ่านหน่วยงานที่คุณสนใจ"
        dataLabel={dataLabel}
        highlights={highlights}
        isLoading={isLoading}
      />
    </div>
  );
}
