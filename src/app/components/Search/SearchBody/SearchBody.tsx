"use client";

import type { BudgetItem, BudgetMinistryItem } from "@/types/budget";
import SearchBudgetProportion from "./SearchBudgetProportion";
import SearchBudgetTrend from "./SearchBudgetTrend";
import BudgetListSection from "./BudgetListSection";
import BudgetMinistryListSection from "./BudgetMinitryListSection";

interface SearchBodyProps {
  budgetData: BudgetItem[];
  ministryData: BudgetMinistryItem[];
  keywords: string[];
}

export default function SearchBody({
  budgetData,
  ministryData,
  keywords,
}: SearchBodyProps) {
  return (
    <div className="content-container flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[32px] md:flex-row">
        <SearchBudgetProportion
          keywords={keywords}
          filteredBudget={1000000}
          totalBudget={4000000}
        />
        <SearchBudgetTrend
          keywords={keywords}
          filteredBudget={1000000}
          totalBudget={4000000}
        />
      </div>
      <div>
        <BudgetListSection
          keywords={keywords}
          year={2569}
          version="ฉบับร่าง"
          data={budgetData}
        />
      </div>
      <div>
        <BudgetMinistryListSection
          keywords={keywords}
          year={2569}
          version="ฉบับร่าง"
          data={ministryData}
        />
      </div>
    </div>
  );
}
