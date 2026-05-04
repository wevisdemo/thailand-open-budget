"use client";
import type { BudgetItem, BudgetMinistryItem } from "@/types/budget";
import Header from "@/app/components/shared/Header";
import AboutSection from "@/app/components/shared/AboutSection";
import Breadcrumb from "@/app/components/shared/Breadcrumb";
import SearchHeader from "@/app/components/Search/SearchHeader/SearchHeader";
import SearchBody from "@/app/components/Search/SearchBody/SearchBody";
import SummaryInfo from "@/app/components/Search/SearchBody/SummaryInfo";
import SearchEmptyState from "@/app/components/Search/SearchEmptyState";
import SearchNotFound from "@/app/components/Search/SearchNotFound";
import Dropdown, { type DropdownOption } from "../shared/Dropdown";
import BudgetVersionInfoModal from "./BudgetVersionInfoModal";
import { useState } from "react";
import type { Tag } from "@/types/search";

interface SearchTemplateProps {
  budgetData: BudgetItem[];
}

export default function SearchTemplate({ budgetData }: SearchTemplateProps) {
  const docSourceDropdownOptions: DropdownOption[] = [
    { value: "2566-draft-1", label: "2566 ฉบับร่าง (วาระ 1)" },
    { value: "2567-draft-1", label: "2567 ฉบับร่าง (วาระ 1)" },
    { value: "2568-draft-1", label: "2568 ฉบับร่าง (วาระ 1)" },
    { value: "2569-draft-1", label: "2569 ฉบับร่าง (วาระ 1)" },
    { value: "2569-approved-3", label: "2569 สภาอนุมัติแล้ว (วาระ 3)" },
  ];
  const [selectedDocSource, setSelectedDocSource] =
    useState<DropdownOption | null>(docSourceDropdownOptions[0]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [versionInfoOpen, setVersionInfoOpen] = useState(false);

  const keywords = tags.map((t) => t.word.toLowerCase());
  const displayBudgetList = budgetData.filter((item) =>
    keywords.some(
      (kw) =>
        item.description.toLowerCase().includes(kw) ||
        item.project.toLowerCase().includes(kw) ||
        item.plan.toLowerCase().includes(kw),
    ),
  );

  const totalBudget = budgetData.reduce((sum, item) => sum + item.amount, 0);

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
    totalBudget: Math.round(
      displayBudgetList.reduce((sum, item) => sum + item.amount, 0) /
        totalBudget,
    ),
    totalMinistry: new Set(displayBudgetList.map((item) => item.ministry)).size,
  };

  return (
    <main className="mx-auto flex w-full flex-col">
      <Header />
      <BudgetVersionInfoModal
        isOpen={versionInfoOpen}
        onClose={() => setVersionInfoOpen(false)}
      />
      <div className="flex flex-col">
        <div>
          <div className="border-gray-20 flex items-center justify-between border-b-[2px] bg-white px-[32px] py-[4px]">
            <Breadcrumb
              items={[
                { label: "หน้าหลัก", href: "/" },
                { label: "ผลการค้นหา", href: "/search" },
              ]}
            />
            <div className="w-[220px]">
              <Dropdown
                options={docSourceDropdownOptions}
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
          <section className="bg-white px-[16px] py-[24px]">
            <SearchHeader tags={tags} onTagsChange={setTags} />
          </section>
        </div>
        {tags.length === 0 ? (
          <SearchEmptyState />
        ) : displayBudgetList.length === 0 ? (
          <SearchNotFound tags={tags} onClear={() => setTags([])} />
        ) : (
          <>
            <section className="bg-white px-[16px] pb-[24px]">
              <SummaryInfo
                itemAmount={summaryInfo.itemAmount}
                totalBudget={summaryInfo.totalBudget}
                totalMinistry={summaryInfo.totalMinistry}
              />
            </section>
            <section className="px-[16px] py-[40px]">
              <SearchBody
                budgetData={displayBudgetList}
                ministryData={displayMinistryList}
                tags={tags}
              />
            </section>
          </>
        )}
      </div>
      <AboutSection />
    </main>
  );
}
