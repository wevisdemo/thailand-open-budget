"use client";

import { useMemo, useState } from "react";
import { DOC_SOURCE_OPTIONS, type DocSourceValue } from "@/constants/budget";
import {
  getOrganizationHighlights,
  groupByMinistry,
} from "@/constants/organization";
import { useOrganizationYearTotals } from "@/hooks/useOrganizationYearTotals";
import { useUrlSearch } from "@/hooks/useUrlSearch";
import { type DropdownOption } from "@/app/components/shared/ui/Dropdown";
import AboutSection from "@/app/components/shared/layout/AboutSection";
import Footer from "@/app/components/shared/layout/Footer";
import OrganizationHighlightCarousel from "@/app/components/shared/organization/OrganizationHighlightCarousel";
import BudgetNavbar from "@/app/components/shared/layout/BudgetNavbar";
import BudgetVersionInfoModal from "@/app/components/shared/modals/BudgetVersionInfoModal";
import SummaryStatItem from "@/app/components/shared/ui/SummaryStatItem";
import OrganizationListSection from "./OrganizationListSection";

const BREADCRUMB = [
  { label: "หน้าหลัก", href: "/" },
  { label: "หน้ารวมกระทรวง", href: "/organizations" },
];

export default function OrganizationsTemplate() {
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

  const { data, status } = useOrganizationYearTotals(
    selectedDocSource.value as DocSourceValue,
  );
  const [versionInfoOpen, setVersionInfoOpen] = useState(false);

  const groups = useMemo(() => groupByMinistry(data), [data]);
  const highlights = useMemo(
    () => getOrganizationHighlights(data, selectedDocSource.value),
    [data, selectedDocSource.value],
  );
  const totalBudget = data.reduce((sum, unit) => sum + unit.budget_amount, 0);

  const year = parseInt(selectedDocSource.value);
  const isLoading = status === "idle" || status === "loading";

  return (
    <main className="mx-auto flex w-full flex-col">
      <BudgetVersionInfoModal
        isOpen={versionInfoOpen}
        onClose={() => setVersionInfoOpen(false)}
      />
      <BudgetNavbar
        breadcrumbItems={BREADCRUMB}
        selectedDocSource={selectedDocSource}
        onChangeDocSource={onChangeDocSource}
        onOpenVersionInfo={() => setVersionInfoOpen(true)}
      />
      <section className="bg-white px-[24px] pt-[24px] pb-[24px] md:pt-[56px]">
        <div className="mx-auto flex w-full max-w-[1128px] flex-col gap-[32px]">
          <div className="flex flex-col gap-[8px]">
            <h1 className="font-serif text-[42px] font-bold">
              สำรวจงบประมาณผ่านหน่วยงาน
            </h1>
            <p className="text-text-01">
              ค้นหางบประมาณผ่านหน่วยงานที่คุณสนใจ
              ตั้งแต่กระทรวงจนถึงหน่วยงานในพื้นที่
              เพื่อดูว่าเงินภาษีถูกจัดสรรไปทำอะไร
            </p>
          </div>
          <div className="flex flex-col md:flex-row">
            <SummaryStatItem
              label="กระทรวง/หน่วยงานเทียบเท่ากระทรวง"
              value={isLoading ? "-" : groups.length.toLocaleString()}
              unit="กลุ่มหน่วยงาน"
            />
            <SummaryStatItem
              label="กรม/หน่วยงานเทียบเท่ากรม"
              value={isLoading ? "-" : data.length.toLocaleString()}
              unit="หน่วยงาน"
            />
            <SummaryStatItem
              label={`งบประมาณทั้งหมด (ปีงบฯ ${year})`}
              value={
                isLoading
                  ? "-"
                  : Math.round(totalBudget / 1_000_000).toLocaleString()
              }
              unit="ล้านบาท"
            />
          </div>
          <div className="flex flex-col gap-[16px]">
            <h2 className="font-serif text-[28px] font-bold">
              หน่วยงานที่น่าสนใจ
            </h2>
            <OrganizationHighlightCarousel
              label="หน่วยงานที่น่าสนใจ"
              dataLabel={selectedDocSource.label}
              highlights={highlights}
              isLoading={isLoading}
            />
          </div>
        </div>
      </section>
      <section className="bg-ui-01 px-[24px] py-[32px]">
        {/* Keyed by year so a new year starts from page 1, unfiltered. */}
        <OrganizationListSection
          key={selectedDocSource.value}
          groups={groups}
          totalBudget={totalBudget}
          year={year}
          version={selectedDocSource.label.replace(/^\d{4}\s*/, "")}
          dataValue={selectedDocSource.value}
          isLoading={isLoading}
          isError={status === "error"}
        />
      </section>
      <AboutSection />
      <Footer />
    </main>
  );
}
