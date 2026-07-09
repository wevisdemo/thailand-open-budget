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

  const [selectedDocSource, setSelectedDocSource] =
    useState<DropdownOption | null>(
      DOC_SOURCE_OPTIONS.find((o) => o.value === initialSource) ??
        DOC_SOURCE_OPTIONS[DOC_SOURCE_OPTIONS.length - 1],
    );
  // Home search box is transient — keywords must NOT persist to the home URL.
  // Otherwise returning to the homepage re-seeds the old keyword and it leaks
  // into the next search. `q` belongs to the /search page only.
  const { tags, addTag, removeTag, setTags } = useSearchTags();

  // Home search box is transient. A fresh soft-nav mount already starts empty,
  // but a cached instance restored by browser-back / bfcache reinstates the
  // previous chips and leaks the old keyword into the next search. `pageshow`
  // covers bfcache; `popstate` covers soft back/forward navigations.
  useEffect(() => {
    const clear = () => setTags([]);
    window.addEventListener("pageshow", clear);
    window.addEventListener("popstate", clear);
    return () => {
      window.removeEventListener("pageshow", clear);
      window.removeEventListener("popstate", clear);
    };
  }, [setTags]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedDocSource) params.set("budget_source", selectedDocSource.value);
    const paramString = params.toString();
    if (`?${paramString}` !== window.location.search) {
      router.replace(`${pathname}?${paramString}`, { scroll: false });
    }
  }, [selectedDocSource, pathname, router]);

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
        isLoading={status === "idle" || status === "loading"}
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
          isLoading={status === "idle" || status === "loading"}
        />
        <BudgetSectionCountry
          dataLabel={selectedDocSource?.label ?? ""}
          data={budgetData}
          dataValue={selectedDocSource?.value ?? ""}
          isLoading={status === "idle" || status === "loading"}
        />
      </section>
      <section id="articles" className="bg-ui-02 px-[24px] py-[64px]">
        <ArticalSection />
      </section>
      <section className="bg-[#A5EBD7]">
        <SupportSection />
      </section>
      <AboutSection page="homepage" />
      <Footer />
    </main>
  );
}
