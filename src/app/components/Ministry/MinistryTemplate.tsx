"use client";

import { useMemo, useState } from "react";
import type { OrganizationCoreContent } from "@/types/organization";
import { DOC_SOURCE_OPTIONS, type DocSourceValue } from "@/constants/budget";
import {
  getMinistryYearTotal,
  getRelatedDocuments,
} from "@/constants/ministry";
import { useBudgetData } from "@/hooks/useBudgetData";
import { useOrganizationYearTotals } from "@/hooks/useOrganizationYearTotals";
import { useUrlSearch } from "@/hooks/useUrlSearch";
import { type DropdownOption } from "@/app/components/shared/Dropdown";
import AboutSection from "@/app/components/shared/AboutSection";
import Footer from "@/app/components/shared/Footer";
import BudgetNavbar from "@/app/components/shared/BudgetNavbar";
import BudgetVersionInfoModal from "@/app/components/shared/BudgetVersionInfoModal";
import SummaryStatItem from "@/app/components/shared/SummaryStatItem";
import BudgetProportionCard from "@/app/components/shared/BudgetProportionCard";
import BudgetTrendCard from "@/app/components/shared/BudgetTrendCard";
import MinistryCoreContent from "./MinistryCoreContent";
import RelatedDocuments from "./RelatedDocuments";
import ShareButtons from "./ShareButtons";
import coreContentRaw from "@/app/data/ministry_core_content.json" with { type: "json" };

const coreContent = coreContentRaw as Record<string, OrganizationCoreContent>;

interface MinistryTemplateProps {
  ministryId: number;
  ministryName: string;
}

export default function MinistryTemplate({
  ministryId,
  ministryName,
}: MinistryTemplateProps) {
  // Same URL handling as the search page: the address bar is the source of
  // truth for the year, and writes go through the History API.
  const urlSearch = useUrlSearch();
  const sourceValue = new URLSearchParams(urlSearch).get("budget_source");
  const selectedDocSource: DropdownOption =
    DOC_SOURCE_OPTIONS.find((o) => o.value === sourceValue) ??
    DOC_SOURCE_OPTIONS[DOC_SOURCE_OPTIONS.length - 1];

  function onChangeDocSource(option: DropdownOption) {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?budget_source=${option.value}`,
    );
  }

  const docSource = selectedDocSource.value as DocSourceValue;
  // Every year's organization totals are loaded for the trend; the selected
  // year's also feed the rest of the page.
  const totals2568 = useOrganizationYearTotals("2568-draft-1");
  const totals2569 = useOrganizationYearTotals("2569-draft-1");
  const totals2570 = useOrganizationYearTotals("2570-draft-1");
  const { data: yearTotals, status: totalsStatus } =
    docSource === "2568-draft-1"
      ? totals2568
      : docSource === "2569-draft-1"
        ? totals2569
        : totals2570;
  const { data: budgetData, status: budgetStatus } = useBudgetData(docSource);
  const [versionInfoOpen, setVersionInfoOpen] = useState(false);

  const units = useMemo(
    () => yearTotals.filter((unit) => unit.ministry_id === ministryId),
    [yearTotals, ministryId],
  );
  const items = useMemo(
    () => budgetData.filter((item) => item.ministry_id === ministryId),
    [budgetData, ministryId],
  );
  const relatedDocuments = useMemo(() => getRelatedDocuments(items), [items]);
  const totalBudget = units.reduce((sum, unit) => sum + unit.budget_amount, 0);
  const countryBudget = yearTotals.reduce(
    (sum, unit) => sum + unit.budget_amount,
    0,
  );

  const year = parseInt(selectedDocSource.value);
  const version = selectedDocSource.label.replace(/^\d{4}\s*/, "");
  const trendTotals = [
    getMinistryYearTotal(totals2568.data, ministryId, 2568, year === 2568),
    getMinistryYearTotal(totals2569.data, ministryId, 2569, year === 2569),
    getMinistryYearTotal(totals2570.data, ministryId, 2570, year === 2570),
  ];
  const isTotalsLoading = totalsStatus === "idle" || totalsStatus === "loading";
  const isBudgetLoading = budgetStatus === "idle" || budgetStatus === "loading";

  const ministryContent = coreContent[ministryId] ?? null;

  const breadcrumb = [
    { label: "หน้าหลัก", href: "/" },
    { label: "หน้ารวมกระทรวง", href: "/organizations" },
    { label: ministryName },
  ];

  return (
    <main className="mx-auto flex w-full flex-col">
      <BudgetVersionInfoModal
        isOpen={versionInfoOpen}
        onClose={() => setVersionInfoOpen(false)}
      />
      <BudgetNavbar
        breadcrumbItems={breadcrumb}
        selectedDocSource={selectedDocSource}
        onChangeDocSource={onChangeDocSource}
        onOpenVersionInfo={() => setVersionInfoOpen(true)}
      />
      <section className="bg-white px-[24px] pt-[24px] pb-[24px] md:pt-[56px]">
        <div className="mx-auto flex w-full max-w-[1128px] flex-col gap-[32px]">
          <h1 className="font-serif text-[28px] font-bold md:text-[42px]">
            {ministryName}
          </h1>
          <div className="flex flex-col gap-[24px] md:flex-row">
            <div className="min-w-0 flex-1">
              {ministryContent && (
                <MinistryCoreContent content={ministryContent} />
              )}
            </div>
            <div className="flex flex-col gap-[16px] md:w-[240px]">
              {relatedDocuments.length > 0 && (
                <RelatedDocuments documents={relatedDocuments} />
              )}
              <ShareButtons title={ministryName} />
            </div>
          </div>
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
              value={isTotalsLoading ? "-" : units.length.toLocaleString()}
              unit="หน่วยงาน"
            />
            <SummaryStatItem
              label="จำนวนรายการ"
              value={isBudgetLoading ? "-" : items.length.toLocaleString()}
              unit="รายการ"
            />
          </div>
        </div>
      </section>
      <section className="bg-ui-01 px-[24px] py-[32px]">
        <div className="mx-auto flex w-full max-w-[1128px] flex-col gap-[32px] md:flex-row">
          <BudgetProportionCard
            subtitle={ministryName}
            selectedLabel={`งบฯ ${ministryName}`}
            selectedLabelMaxLength={24}
            filteredBudget={totalBudget}
            totalBudget={countryBudget}
            year={year}
            version={version}
          />
          <BudgetTrendCard
            subtitle={ministryName}
            yearTotals={trendTotals}
            version={version}
          />
        </div>
      </section>
      <AboutSection />
      <Footer />
    </main>
  );
}
