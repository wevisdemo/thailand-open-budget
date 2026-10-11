"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "@carbon/icons-react";
import type { BudgetBase } from "@/types/budget";
import type { OrganizationYearTotal } from "@/types/organization";
import { DOC_SOURCE_OPTIONS, type DocSourceValue } from "@/constants/budget";
import {
  getOrganizationYearTotal,
  getRelatedDocuments,
} from "@/constants/ministry";
import { useBudgetData } from "@/hooks/useBudgetData";
import { useBudgetaryCoreContent } from "@/hooks/useBudgetaryCoreContent";
import { useOrganizationYearTotals } from "@/hooks/useOrganizationYearTotals";
import { useUrlSearch } from "@/hooks/useUrlSearch";
import { type DropdownOption } from "@/app/components/shared/Dropdown";
import AboutSection from "@/app/components/shared/AboutSection";
import Footer from "@/app/components/shared/Footer";
import BudgetNavbar from "@/app/components/shared/BudgetNavbar";
import BudgetVersionInfoModal from "@/app/components/shared/BudgetVersionInfoModal";
import SummaryStatItem from "@/app/components/shared/SummaryStatItem";
import CoreContentTabs from "@/app/components/shared/CoreContentTabs";
import RelatedDocuments from "@/app/components/shared/RelatedDocuments";
import ShareButtons from "@/app/components/shared/ShareButtons";
import BudgetProportionCard from "@/app/components/shared/BudgetProportionCard";
import BudgetTrendCard from "@/app/components/shared/BudgetTrendCard";
import BudgetBaseSelect from "@/app/components/shared/BudgetBaseSelect";
import OrganizationItemSection from "@/app/components/shared/OrganizationItemSection";

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
  const router = useRouter();
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
  const { data: budgetData, status: budgetStatus } = useBudgetData(docSource);
  const { data: budgetaryContent } = useBudgetaryCoreContent(budgetaryId);
  const [versionInfoOpen, setVersionInfoOpen] = useState(false);
  // Each card measures the unit against its own pick of base.
  const [shareBase, setShareBase] = useState<BudgetBase>("country");
  const [trendBase, setTrendBase] = useState<BudgetBase>("country");

  const unit = yearTotals.find((u) => u.budgetary_id === budgetaryId) ?? null;
  const items = useMemo(
    () => budgetData.filter((item) => item.budgetary_id === budgetaryId),
    [budgetData, budgetaryId],
  );
  const relatedDocuments = useMemo(() => getRelatedDocuments(items), [items]);

  // A unit is built if it is budgeted in any year; in a year it isn't, there
  // is nothing to show, so the reader goes on to every organization that year.
  const isUnbudgeted = totalsStatus === "success" && unit === null;
  useEffect(() => {
    if (isUnbudgeted) {
      router.replace(`/organizations?budget_source=${docSource}`);
    }
  }, [isUnbudgeted, router, docSource]);

  const year = parseInt(selectedDocSource.value);
  const version = selectedDocSource.label.replace(/^\d{4}\s*/, "");
  const isUnit = (u: OrganizationYearTotal) => u.budgetary_id === budgetaryId;
  const isInBase = (base: BudgetBase) => (u: OrganizationYearTotal) =>
    base === "country" || u.ministry_id === ministryId;
  const shareTotal = getOrganizationYearTotal(
    yearTotals,
    isUnit,
    year,
    true,
    isInBase(shareBase),
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
      isInBase(trendBase),
    ),
  );
  const isTotalsLoading = totalsStatus === "idle" || totalsStatus === "loading";
  const isBudgetLoading = budgetStatus === "idle" || budgetStatus === "loading";
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
      <section className="bg-white px-[24px] pt-[24px] pb-[24px] md:pt-[56px]">
        <div className="mx-auto flex w-full max-w-[1128px] flex-col gap-[32px]">
          <div className="flex flex-col gap-[8px]">
            <Link
              href={ministryHref}
              className="text-text-01! flex w-fit items-center gap-[8px] text-[18px] font-bold no-underline! hover:underline!"
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
              {budgetaryContent && (
                <CoreContentTabs content={budgetaryContent} />
              )}
            </div>
            <div className="flex flex-col gap-[16px] md:w-[240px]">
              {relatedDocuments.length > 0 && (
                <RelatedDocuments documents={relatedDocuments} />
              )}
              <ShareButtons title={budgetaryName} />
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <SummaryStatItem
              label={`งบประมาณทั้งหมด (ปีงบฯ ${year})`}
              value={
                isTotalsLoading || !unit
                  ? "-"
                  : Math.round(unit.budget_amount / 1_000_000).toLocaleString()
              }
              unit="ล้านบาท"
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
        <div className="mx-auto flex w-full max-w-[1128px] flex-col gap-[48px]">
          <div className="flex flex-col gap-[32px] md:flex-row">
            <BudgetProportionCard
              subtitle={budgetaryName}
              selectedLabel={`งบฯ ${budgetaryName}`}
              selectedLabelMaxLength={24}
              filteredBudget={shareTotal.totalSelectedBaht}
              totalBudget={shareTotal.totalBudgetBaht}
              totalLabel={
                shareBase === "country"
                  ? "งบฯ ทั้งประเทศ"
                  : `งบฯ ${ministryName}`
              }
              donutLabel={
                shareBase === "country" ? "ของงบฯ ประเทศ" : "ของงบฯ กระทรวง"
              }
              baseSelect={
                <BudgetBaseSelect
                  id="share-base"
                  base={shareBase}
                  onChange={setShareBase}
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
                  base={trendBase}
                  onChange={setTrendBase}
                />
              }
            />
          </div>
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
      <AboutSection />
      <Footer />
    </main>
  );
}
