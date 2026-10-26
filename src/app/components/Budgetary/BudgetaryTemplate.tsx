"use client";

import { useMemo, useState } from "react";
import type { BudgetBase } from "@/types/budget";
import type { OrganizationYearTotal } from "@/types/organization";
import {
  DOC_SOURCE_OPTIONS,
  type DocSourceValue,
  getPreviousDocSource,
} from "@/constants/budget";
import {
  getOrganizationYearTotal,
  getRelatedDocuments,
} from "@/constants/ministry";
import { useBudgetData } from "@/hooks/useBudgetData";
import { useBudgetaryCoreContent } from "@/hooks/useBudgetaryCoreContent";
import { useOrganizationYearTotals } from "@/hooks/useOrganizationYearTotals";
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
}

export default function BudgetaryTemplate({
  ministryId,
  ministryName,
  budgetaryId,
  budgetaryName,
}: BudgetaryTemplateProps) {
  // Same URL handling as the ministry page: the address bar is the source of
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
  // The unit's ministry's items; the unit's own are picked out below.
  const { data: budgetData, status: budgetStatus } = useBudgetData(
    docSource,
    ministryId,
  );
  // The year before's items, likewise the ministry's, for the treemap's
  // change from the previous year. The first year in the data has none.
  const previousDocSource = getPreviousDocSource(docSource);
  const { data: previousBudgetData, status: previousStatus } = useBudgetData(
    previousDocSource,
    ministryId,
  );
  const { data: budgetaryContent } = useBudgetaryCoreContent(budgetaryId);
  const [versionInfoOpen, setVersionInfoOpen] = useState(false);
  // Both cards measure the unit against the same base; either card's
  // dropdown changes it for both.
  const [base, setBase] = useState<BudgetBase>("country");

  const unit = yearTotals.find((u) => u.budgetary_id === budgetaryId) ?? null;
  const items = useMemo(
    () => budgetData.filter((item) => item.budgetary_id === budgetaryId),
    [budgetData, budgetaryId],
  );
  const previousItems = useMemo(
    () =>
      previousBudgetData.filter((item) => item.budgetary_id === budgetaryId),
    [previousBudgetData, budgetaryId],
  );
  const relatedDocuments = useMemo(() => getRelatedDocuments(items), [items]);
  const countryBudget = yearTotals.reduce(
    (sum, total) => sum + total.budget_amount,
    0,
  );

  // A unit is built if it is budgeted in any year; in a year it isn't, there
  // is nothing to show below the title.
  const isUnbudgeted = totalsStatus === "success" && unit === null;

  const year = parseInt(selectedDocSource.value);
  const version = selectedDocSource.label.replace(/^\d{4}\s*/, "");
  const isUnit = (u: OrganizationYearTotal) => u.budgetary_id === budgetaryId;
  const isInBase = (u: OrganizationYearTotal) =>
    base === "country" || u.ministry_id === ministryId;
  const shareTotal = getOrganizationYearTotal(
    yearTotals,
    isUnit,
    year,
    true,
    isInBase,
  );
  const trendTotals = [
    { data: totals2568.data, year: 2568 },
    { data: totals2569.data, year: 2569 },
    { data: totals2570.data, year: 2570 },
  ].map(({ data, year: totalYear }) =>
    getOrganizationYearTotal(
      data,
      isUnit,
      totalYear,
      totalYear === year,
      isInBase,
    ),
  );
  const isTotalsLoading = totalsStatus === "idle" || totalsStatus === "loading";
  const isBudgetLoading = budgetStatus === "idle" || budgetStatus === "loading";
  const isPreviousLoading =
    previousDocSource !== null &&
    (previousStatus === "idle" || previousStatus === "loading");
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
        content={budgetaryContent}
        relatedDocuments={relatedDocuments}
        year={year}
        totalBudget={unit?.budget_amount ?? null}
        itemCount={items.length}
        isTotalsLoading={isTotalsLoading}
        isBudgetLoading={isBudgetLoading}
        isUnbudgeted={isUnbudgeted}
      />
      {isUnbudgeted ? (
        <OrganizationEmptyState />
      ) : (
        <section className="bg-ui-01 px-[24px] py-[32px]">
          <div className="mx-auto flex w-full max-w-[1128px] flex-col gap-[48px]">
            <div className="flex flex-col gap-[32px] md:flex-row">
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
              items={items}
              previousItems={
                previousDocSource && previousStatus === "success"
                  ? previousItems
                  : null
              }
              countryBudget={countryBudget}
              year={year}
              csvName={`budgetary_${budgetaryId}`}
              isLoading={isBudgetLoading || isPreviousLoading}
              isError={budgetStatus === "error"}
            />
            <OrganizationItemSection
              items={items}
              isMinistry={false}
              year={year}
              version={version}
              docSource={docSource}
              isLoading={isBudgetLoading}
              isError={budgetStatus === "error"}
            />
          </div>
        </section>
      )}
      <AboutSection />
      <Footer />
    </main>
  );
}
