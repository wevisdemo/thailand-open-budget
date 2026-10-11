"use client";

import { useMemo, useState } from "react";
import { DOC_SOURCE_OPTIONS, type DocSourceValue } from "@/constants/budget";
import { useBudgetData } from "@/hooks/useBudgetData";
import { useOrganizationYearTotals } from "@/hooks/useOrganizationYearTotals";
import { useUrlSearch } from "@/hooks/useUrlSearch";
import { type DropdownOption } from "@/app/components/shared/Dropdown";
import AboutSection from "@/app/components/shared/AboutSection";
import Footer from "@/app/components/shared/Footer";
import SearchNavbar from "@/app/components/Search/SearchNavbar";
import BudgetVersionInfoModal from "@/app/components/Search/BudgetVersionInfoModal";
import SummaryInfoStatItem from "@/app/components/Search/SearchBody/SummaryInfoStatItem";

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
  const { data: yearTotals, status: totalsStatus } =
    useOrganizationYearTotals(docSource);
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
  const totalBudget = units.reduce((sum, unit) => sum + unit.budget_amount, 0);

  const year = parseInt(selectedDocSource.value);
  const isTotalsLoading = totalsStatus === "idle" || totalsStatus === "loading";
  const isBudgetLoading = budgetStatus === "idle" || budgetStatus === "loading";

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
      <SearchNavbar
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
          <div className="flex flex-col md:flex-row">
            <SummaryInfoStatItem
              label={`งบประมาณทั้งหมด (ปีงบฯ ${year})`}
              value={
                isTotalsLoading
                  ? "-"
                  : Math.round(totalBudget / 1_000_000).toLocaleString()
              }
              unit="ล้านบาท"
            />
            <SummaryInfoStatItem
              label="จำนวนกรม/หน่วยงานเทียบเท่ากรม"
              value={isTotalsLoading ? "-" : units.length.toLocaleString()}
              unit="หน่วยงาน"
            />
            <SummaryInfoStatItem
              label="จำนวนรายการ"
              value={isBudgetLoading ? "-" : items.length.toLocaleString()}
              unit="รายการ"
            />
          </div>
        </div>
      </section>
      <AboutSection />
      <Footer />
    </main>
  );
}
