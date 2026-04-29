"use client";
import type { BudgetItem, BudgetMinistryItem } from "@/types/budget";
import Header from "@/app/components/shared/Header";
import AboutSection from "@/app/components/shared/AboutSection";
import Breadcrumb from "@/app/components/shared/Breadcrumb";
import SearchHeader from "@/app/components/Search/SearchHeader/SearchHeader";
import SearchBody from "@/app/components/Search/SearchBody/SearchBody";
import Dropdown, { DropdownOption } from "../shared/Dropdown";
import { useState } from "react";
import type { Tag } from "@/types/search";

interface SearchTemplateProps {
  headerSummaryInfo: {
    itemAmount: number;
    totalBudget: number;
    totalDepartment: number;
  };
  budgetData: BudgetItem[];
  ministryData: BudgetMinistryItem[];
}

export default function SearchTemplate({
  headerSummaryInfo,
  budgetData,
  ministryData,
}: SearchTemplateProps) {
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
  return (
    <main className="mx-auto flex w-full flex-col gap-8">
      <Header />
      <div className="flex flex-col gap-2">
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
                footerLink={{ label: "แต่ละวาระต่างกันอย่างไร?", href: "/" }}
              />
            </div>
          </div>
          <section className="border-gray-20 border-b-[1px] bg-white px-[16px] py-[40px]">
            <SearchHeader
              summaryInfo={headerSummaryInfo}
              tags={tags}
              onTagsChange={setTags}
            />
          </section>
        </div>

        <section className="px-[16px] py-[40px]">
          <SearchBody
            budgetData={budgetData}
            ministryData={ministryData}
            keywords={tags.map((t) => t.word)}
          />
        </section>
      </div>
      <AboutSection />
    </main>
  );
}
