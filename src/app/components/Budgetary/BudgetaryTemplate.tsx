"use client";

import { useMemo, useState } from "react";
import type { BudgetBase, BudgetYearTotal } from "@/types/budget";
import type { BudgetaryPageData } from "@/types/organization";
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
import BudgetBaseSelect from "./BudgetBaseSelect";
import OrganizationItemSection from "@/app/components/shared/organization/OrganizationItemSection";
import BudgetProportionComparisonSection from "@/app/components/shared/charts/BudgetProportionComparisonSection";
import OrganizationEmptyState from "@/app/components/shared/organization/OrganizationEmptyState";
import BudgetaryHeaderSection from "./BudgetaryHeaderSection";

interface BudgetaryTemplateProps {
  ministryId: number;
  ministryName: string;
  budgetaryId: number;
  budgetaryName: string;
  // Every document's figures, built in at build time. Only the item table
  // loads its items.
  pageData: BudgetaryPageData;
}

export default function BudgetaryTemplate({
  ministryId,
  ministryName,
  budgetaryId,
  budgetaryName,
  pageData,
}: BudgetaryTemplateProps) {
  // Same URL handling as the ministry page: the address bar is the source of
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
  const { unit, countryBudget, itemCount, relatedDocuments, trees } =
    pageData.years[docSource];
  // The year before's groups, for the treemap's change from the previous
  // year. The first year in the data has none.
  const previousDocSource = getPreviousDocSource(docSource);
  const previousTrees = previousDocSource
    ? pageData.years[previousDocSource].trees
    : null;
  // The unit's ministry's items; the unit's own are picked out below.
  const { data: ministryItems, status: itemsStatus } = useMinistryItems(
    docSource,
    ministryId,
  );
  const [versionInfoOpen, setVersionInfoOpen] = useState(false);
  // Both cards measure the unit against the same base; either card's
  // dropdown changes it for both.
  const [base, setBase] = useState<BudgetBase>("country");

  const items = useMemo(
    () => ministryItems.filter((item) => item.budgetary_id === budgetaryId),
    [ministryItems, budgetaryId],
  );

  // A unit is built if it is budgeted in any year; in a year it isn't, there
  // is nothing to show below the title.
  const isUnbudgeted = unit === null;

  const year = parseInt(selectedDocSource.value);
  const version = selectedDocSource.label.replace(/^\d{4}\s*/, "");
  // The unit's total and the base it is measured against, in a document.
  function getYearTotal(
    trendYear: number,
    trendSource: DocSourceValue,
  ): BudgetYearTotal {
    const data = pageData.years[trendSource];
    return {
      year: trendYear,
      isCurrent: trendYear === year,
      totalSelectedBaht: data.unit?.budget_amount ?? 0,
      totalBudgetBaht:
        base === "country" ? data.countryBudget : data.ministryBudget,
    };
  }
  const shareTotal = getYearTotal(year, docSource);
  // Each year is read from the selected document's stage (approved or draft);
  // a year without that stage has no point in the trend.
  const trendTotals = [2568, 2569, 2570].flatMap((trendYear) => {
    const trendSource = getStageDocSource(trendYear, docSource);
    return trendSource ? [getYearTotal(trendYear, trendSource)] : [];
  });
  const ministryHref = `/organizations/${ministryId}?budget_source=${docSource}`;

  const breadcrumb = [
    { label: "หน้าหลัก", href: "/" },
    { label: "หน้ารวมกระทรวง", href: "/organizations" },
    { label: ministryName, href: ministryHref },
    { label: budgetaryName },
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
      <BudgetaryHeaderSection
        ministryName={ministryName}
        ministryHref={ministryHref}
        budgetaryName={budgetaryName}
        content={pageData.coreContent}
        relatedDocuments={relatedDocuments}
        year={year}
        totalBudget={unit?.budget_amount ?? null}
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
                subtitle={budgetaryName}
                selectedLabel={`งบฯ ${budgetaryName}`}
                selectedLabelMaxLength={24}
                filteredBudget={shareTotal.totalSelectedBaht}
                totalBudget={shareTotal.totalBudgetBaht}
                totalLabel={
                  base === "country" ? "งบฯ ทั้งประเทศ" : `งบฯ ${ministryName}`
                }
                donutLabel={
                  base === "country" ? "ของงบฯ ประเทศ" : "ของงบฯ กระทรวง"
                }
                baseSelect={
                  <BudgetBaseSelect
                    id="share-base"
                    base={base}
                    onChange={setBase}
                  />
                }
                year={year}
                version={version}
              />
              <BudgetTrendCard
                subtitle={budgetaryName}
                yearTotals={trendTotals}
                version={version}
                baseSelect={
                  <BudgetBaseSelect
                    id="trend-base"
                    base={base}
                    onChange={setBase}
                  />
                }
              />
            </div>
            <BudgetProportionComparisonSection
              trees={trees}
              previousTrees={previousTrees}
              countryBudget={countryBudget}
              year={year}
              csvName={`budgetary_${budgetaryId}`}
            />
            <OrganizationItemSection
              items={items}
              isMinistry={false}
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
