"use client";
import { DOC_SOURCE_OPTIONS, type DocSourceValue } from "@/constants/budget";
import AboutSection from "@/app/components/shared/AboutSection";
import Dropdown, { type DropdownOption } from "../shared/Dropdown";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSearchTags } from "@/app/store/useSearchTags";
import { useBudgetData } from "@/hooks/useBudgetData";
import SearchHeader from "./SearchHomepage/SearchHeader";
import HeroSection from "./HomeSections/HeroSection";
import BudgetVersionInfoModal from "../Search/BudgetVersionInfoModal";
import NavigateSection from "./HomeSections/NavigateSection";
import BudgetSection from "./HomeSections/BudgetSection";
import BudgetSectionCountry from "./HomeSections/BudgetSectionCountry";
import ArticalSection from "./HomeSections/ArticalSection";
import SupportSection from "./HomeSections/SupportSection";
import Footer from "../shared/Footer";

export default function HomeTemplate() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSource = searchParams.get("budget_source");
  const initialKeywords =
    searchParams.get("q")?.split(",").filter(Boolean) ?? [];

  const [selectedDocSource, setSelectedDocSource] =
    useState<DropdownOption | null>(
      DOC_SOURCE_OPTIONS.find((o) => o.value === initialSource) ??
        DOC_SOURCE_OPTIONS[DOC_SOURCE_OPTIONS.length - 1],
    );
  const { tags, setTags, addTag, removeTag } = useSearchTags(initialKeywords);

  useEffect(() => {
    const params = new URLSearchParams();
    if (tags.length > 0) params.set("q", tags.map((t) => t.word).join(","));
    if (selectedDocSource) params.set("budget_source", selectedDocSource.value);
    const paramString = params.toString();
    if (`?${paramString}` !== window.location.search) {
      router.replace(`${pathname}?${paramString}`, { scroll: false });
    }
  }, [tags, selectedDocSource, pathname, router]);

  const { data: budgetData, status } = useBudgetData(
    (selectedDocSource?.value as DocSourceValue) ?? null,
  );
  const [versionInfoOpen, setVersionInfoOpen] = useState(false);
  const totalBudgetAmount = budgetData.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const summaryInfo = {
    itemAmount: budgetData.length,
    totalBudgetAmount: Math.round(totalBudgetAmount / 1_000_000),
    totalMinistry: new Set(budgetData.map((item) => item.ministry)).size,
  };

  return (
    <main className="mx-auto flex w-full flex-col">
      <BudgetVersionInfoModal
        isOpen={versionInfoOpen}
        onClose={() => setVersionInfoOpen(false)}
      />
      <div className="border-gray-20 sticky top-0 z-10 flex items-center justify-end border-b-[2px] bg-white px-[8px] py-[4px] md:px-[32px]">
        <div className="w-[220px]">
          <Dropdown
            options={DOC_SOURCE_OPTIONS}
            selectedOption={selectedDocSource}
            onChange={setSelectedDocSource}
            placeholder="Choose an option"
            footerLink={{
              label: "แต่ละวาระต่างกันอย่างไร?",
              onClick: () => setVersionInfoOpen(true),
            }}
          />
        </div>
      </div>
      <HeroSection
        itemAmount={summaryInfo.itemAmount}
        totalBudgetAmount={summaryInfo.totalBudgetAmount}
        totalMinistry={summaryInfo.totalMinistry}
        dropdownSelectedOption={selectedDocSource?.label ?? ""}
        year={
          selectedDocSource
            ? parseInt(selectedDocSource.value).toString()
            : new Date().getFullYear().toString()
        }
      />
      <section className="bg-ui-01 px-[24px]">
        <NavigateSection />
      </section>
      <section
        id="search"
        className="flex flex-col gap-[64px] bg-white px-[24px] py-[64px]"
      >
        <SearchHeader
          tags={tags}
          addTag={addTag}
          removeTag={removeTag}
          data={selectedDocSource?.value ?? ""}
        />
        <BudgetSection
          dataLabel={selectedDocSource?.label ?? ""}
          data={budgetData}
          dataValue={selectedDocSource?.value ?? ""}
        />
        <BudgetSectionCountry
          dataLabel={selectedDocSource?.label ?? ""}
          data={budgetData}
          dataValue={selectedDocSource?.value ?? ""}
        />
      </section>
      <section id="articles" className="bg-ui-02 px-[24px] py-[64px]">
        <ArticalSection />
      </section>
      <section className="bg-[#A5EBD7]">
        <SupportSection />
      </section>
      <AboutSection />
      <Footer />
    </main>
  );
}
