"use client";
import type {
  BudgetItem,
  BudgetMinistryItem,
  BudgetYearTotal,
} from "@/types/budget";
import { DOC_SOURCE_OPTIONS, type DocSourceValue } from "@/constants/budget";
import AboutSection from "@/app/components/shared/AboutSection";
import SearchHeader from "@/app/components/Search/SearchHeader/SearchHeader";
import SearchBody from "@/app/components/Search/SearchBody/SearchBody";
import SearchBodySkeleton from "@/app/components/Search/SearchBody/SearchBodySkeleton";
import SummaryInfo from "@/app/components/Search/SearchBody/SummaryInfo";
import SearchEmptyState from "@/app/components/Search/SearchEmptyState";
import SearchNotFound from "@/app/components/Search/SearchNotFound";
import SearchNavbar from "@/app/components/Search/SearchNavbar";
import { type DropdownOption } from "../shared/Dropdown";
import BudgetVersionInfoModal from "./BudgetVersionInfoModal";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSearchTags } from "@/app/store/useSearchTags";
import { useBudgetData } from "@/hooks/useBudgetData";
import Footer from "../shared/Footer";

export default function SearchTemplate() {
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
  const { data: budget2568 } = useBudgetData("2568-draft-1");
  const { data: budget2569 } = useBudgetData("2569-draft-1");
  const { data: budget2570 } = useBudgetData("2570-draft-1");
  const [versionInfoOpen, setVersionInfoOpen] = useState(false);

  const keywords = tags.map((t) => t.word.toLowerCase());

  function filterTotal(data: BudgetItem[]): number {
    return data
      .filter((item) =>
        keywords.some(
          (kw) =>
            item.description.toLowerCase().includes(kw) ||
            item.project.toLowerCase().includes(kw) ||
            item.plan.toLowerCase().includes(kw),
        ),
      )
      .reduce((sum, item) => sum + item.amount, 0);
  }

  const yearTotals: BudgetYearTotal[] = [
    {
      year: 2568,
      isCurrent: false,
      totalSelectedBaht: filterTotal(budget2568),
      totalBudgetBaht: budget2568.reduce((s, i) => s + i.amount, 0),
    },
    {
      year: 2569,
      isCurrent: false,
      totalSelectedBaht: filterTotal(budget2569),
      totalBudgetBaht: budget2569.reduce((s, i) => s + i.amount, 0),
    },
    {
      year: 2570,
      isCurrent: true,
      totalSelectedBaht: filterTotal(budget2570),
      totalBudgetBaht: budget2570.reduce((s, i) => s + i.amount, 0),
    },
  ];
  const displayBudgetList = budgetData.filter((item) =>
    keywords.some(
      (kw) =>
        item.description.toLowerCase().includes(kw) ||
        item.project.toLowerCase().includes(kw) ||
        item.plan.toLowerCase().includes(kw),
    ),
  );

  const totalBudgetAmount = budgetData.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const totalDisplayBudget = displayBudgetList.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const displayMinistryList: BudgetMinistryItem[] = Object.values(
    displayBudgetList.reduce<Record<string, BudgetMinistryItem>>(
      (acc, item) => {
        if (!acc[item.budgetary]) {
          acc[item.budgetary] = {
            id: item.budgetary,
            ministry: item.budgetary,
            budgetary: item.ministry,
            amount: 0,
            budgetPercentage: 0,
          };
        }
        acc[item.budgetary].amount += item.amount;
        return acc;
      },
      {},
    ),
  ).map((entry) => ({
    ...entry,
    budgetPercentage:
      totalDisplayBudget > 0 ? (entry.amount / totalDisplayBudget) * 100 : 0,
  }));

  const summaryInfo = {
    itemAmount: displayBudgetList.length,
    totalBudgetAmount: Math.round(
      displayBudgetList.reduce((sum, item) => sum + item.amount, 0) /
        totalBudgetAmount,
    ),
    totalBudgetary: new Set(displayBudgetList.map((item) => item.budgetary))
      .size,
  };

  return (
    <main className="mx-auto flex w-full flex-col">
      <BudgetVersionInfoModal
        isOpen={versionInfoOpen}
        onClose={() => setVersionInfoOpen(false)}
      />
      <SearchNavbar
        selectedDocSource={selectedDocSource}
        onChangeDocSource={setSelectedDocSource}
        onOpenVersionInfo={() => setVersionInfoOpen(true)}
      />
      <div className="flex flex-col">
        <div>
          <section className="bg-white px-[24px] py-[24px] md:py-[32px]">
            <SearchHeader tags={tags} addTag={addTag} removeTag={removeTag} />
          </section>
        </div>
        {status === "loading" ? (
          <SearchBodySkeleton />
        ) : tags.length === 0 ? (
          <SearchEmptyState onAddTag={addTag} />
        ) : displayBudgetList.length === 0 ? (
          <SearchNotFound tags={tags} onClear={() => setTags([])} />
        ) : (
          <>
            <section className="bg-white px-[24px] pb-[24px] md:pb-[32px]">
              <SummaryInfo
                itemAmount={summaryInfo.itemAmount}
                totalBudgetAmount={summaryInfo.totalBudgetAmount}
                totalBudgetary={summaryInfo.totalBudgetary}
                year={
                  selectedDocSource ? parseInt(selectedDocSource.value) : 2569
                }
              />
            </section>
            <section className="px-[24px] py-[40px]">
              <SearchBody
                totalBudgetAmount={totalBudgetAmount}
                displayBudgetList={displayBudgetList}
                ministryData={displayMinistryList}
                tags={tags}
                yearTotals={yearTotals}
                year={
                  selectedDocSource ? parseInt(selectedDocSource.value) : 2569
                }
                version={
                  selectedDocSource
                    ? selectedDocSource.label.replace(/^\d{4}\s*/, "")
                    : ""
                }
              />
            </section>
          </>
        )}
      </div>
      <AboutSection />
      <Footer />
    </main>
  );
}
