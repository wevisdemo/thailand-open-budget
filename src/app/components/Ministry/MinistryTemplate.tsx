"use client";

import { useState } from "react";
import type { BudgetYearTotal } from "@/types/budget";
import type {
  MinistryPageData,
  OrganizationYearTotal,
} from "@/types/organization";
import {
  DOC_SOURCE_OPTIONS,
  type DocSourceValue,
  getStageDocSource,
  getPreviousDocSource,
} from "@/constants/budget";
import { useMinistryItems } from "@/hooks/useMinistryItems";
import { useUrlSearch } from "@/hooks/useUrlSearch";
import { type DropdownOption } from "@/app/components/shared/ui/Dropdown";
import AboutSection from "@/app/components/shared/layout/AboutSection";
import Footer from "@/app/components/shared/layout/Footer";
import BudgetNavbar from "@/app/components/shared/layout/BudgetNavbar";
import BudgetVersionInfoModal from "@/app/components/shared/modals/BudgetVersionInfoModal";
import BudgetProportionCard from "@/app/components/shared/charts/BudgetProportionCard";
import BudgetTrendCard from "@/app/components/shared/charts/BudgetTrendCard";
import MinistryHeaderSection from "./MinistryHeaderSection";
import BudgetaryUnitSection from "./BudgetaryUnitSection";
import OrganizationItemSection from "@/app/components/shared/organization/OrganizationItemSection";
import BudgetProportionComparisonSection from "@/app/components/shared/charts/BudgetProportionComparisonSection";
import OrganizationEmptyState from "@/app/components/shared/organization/OrganizationEmptyState";

interface MinistryTemplateProps {
  ministryId: number;
  ministryName: string;
  // Every document's figures, built in at build time. Only the item table
  // loads its items.
  pageData: MinistryPageData;
}

function sumBudget(units: OrganizationYearTotal[]): number {
  return units.reduce((sum, unit) => sum + unit.budget_amount, 0);
}

export default function MinistryTemplate({
  ministryId,
  ministryName,
  pageData,
}: MinistryTemplateProps) {
  // Same URL handling as the search page: the address bar is the source of
  // truth for the year, and writes go through the History API.
  const urlSearch = useUrlSearch();
  const sourceValue = new URLSearchParams(urlSearch).get("budget_source");
  const selectedDocSource: DropdownOption =
    DOC_SOURCE_OPTIONS.find((o) => o.value === sourceValue) ??
    DOC_SOURCE_OPTIONS[DOC_SOURCE_OPTIONS.length - 1];

  function onChangeDocSource(option: DropdownOption) {
    // Keep the item keywords (`q`) when only the year changes.
    const params = new URLSearchParams(window.location.search);
    params.set("budget_source", option.value);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?${params.toString()}`,
    );
  }

  const docSource = selectedDocSource.value as DocSourceValue;
  const { units, countryBudget, itemCount, relatedDocuments, trees } =
    pageData.years[docSource];
  // The year before's groups, for the treemap's change from the previous
  // year. The first year in the data has none.
  const previousDocSource = getPreviousDocSource(docSource);
  const previousTrees = previousDocSource
    ? pageData.years[previousDocSource].trees
    : null;
  const { data: items, status: itemsStatus } = useMinistryItems(
    docSource,
    ministryId,
  );
  const [versionInfoOpen, setVersionInfoOpen] = useState(false);

  const totalBudget = sumBudget(units);

  const year = parseInt(selectedDocSource.value);
  const version = selectedDocSource.label.replace(/^\d{4}\s*/, "");
  // Each year is read from the selected document's stage (approved or draft);
  // a year without that stage has no point in the trend.
  const trendTotals = [2568, 2569, 2570].flatMap((trendYear) => {
    const trendSource = getStageDocSource(trendYear, docSource);
    if (!trendSource) return [];
    const total: BudgetYearTotal = {
      year: trendYear,
      isCurrent: trendYear === year,
      totalSelectedBaht: sumBudget(pageData.years[trendSource].units),
      totalBudgetBaht: pageData.years[trendSource].countryBudget,
    };
    return [total];
  });
  // A ministry with no units in the selected year has nothing to show below
  // the title.
  const isUnbudgeted = units.length === 0;

  const breadcrumb = [
    { label: "หน้าหลัก", href: "/" },
    { label: "หน้ารวมกระทรวง", href: "/organizations" },
    { label: ministryName },
  ];

  return (
    <main className="mx-auto flex w-full flex-col overflow-x-clip">
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
      <MinistryHeaderSection
        ministryName={ministryName}
        content={pageData.coreContent}
        relatedDocuments={relatedDocuments}
        year={year}
        totalBudget={totalBudget}
        unitCount={units.length}
        itemCount={itemCount}
        isUnbudgeted={isUnbudgeted}
      />
      {isUnbudgeted ? (
        <OrganizationEmptyState />
      ) : (
        <section className="bg-ui-01 px-[24px] py-[32px]">
          <div className="mx-auto flex w-full max-w-[1128px] flex-col gap-[48px]">
            <div className="flex flex-wrap gap-[32px]">
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
            {/* Keyed by year so a new year starts from page 1, unfiltered. */}
            <BudgetaryUnitSection
              key={docSource}
              ministryId={ministryId}
              units={units}
              countryBudget={countryBudget}
              year={year}
              version={version}
              dataValue={docSource}
            />
            <BudgetProportionComparisonSection
              trees={trees}
              previousTrees={previousTrees}
              countryBudget={countryBudget}
              year={year}
              csvName={`ministry_${ministryId}`}
            />
            <OrganizationItemSection
              items={items}
              isMinistry
              year={year}
              version={version}
              docSource={docSource}
              isLoading={itemsStatus === "idle" || itemsStatus === "loading"}
              isError={itemsStatus === "error"}
            />
          </div>
        </section>
      )}
      <AboutSection />
      <Footer />
    </main>
  );
}
