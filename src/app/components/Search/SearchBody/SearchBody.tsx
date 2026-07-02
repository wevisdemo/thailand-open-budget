"use client";

import type {
  BudgetItem,
  BudgetMinistryItem,
  BudgetYearTotal,
} from "@/types/budget";
import type { Tag } from "@/types/search";
import SearchBudgetProportion from "./SearchBudgetProportion";
import SearchBudgetTrend from "./SearchBudgetTrend";
import BudgetListSection from "./BudgetListSection";
import BudgetMinistryListSection from "./BudgetMinitryListSection";
interface SearchBodyProps {
  totalBudgetAmount: number;
  displayBudgetList: BudgetItem[];
  ministryData: BudgetMinistryItem[];
  tags: Tag[];
  yearTotals: BudgetYearTotal[];
  year: number;
  version: string;
}

export default function SearchBody({
  totalBudgetAmount,
  displayBudgetList,
  ministryData,
  tags,
  yearTotals,
  year,
  version,
}: SearchBodyProps) {
  const keywords = tags.map((t) => t.word);

  const totalDisplayBudget = displayBudgetList.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  return (
    <div className="content-container flex flex-col gap-[24px] md:gap-[32px]">
      <div className="flex flex-col gap-[32px] md:flex-row">
        <SearchBudgetProportion
          keywords={keywords}
          filteredBudget={totalDisplayBudget}
          totalBudget={totalBudgetAmount}
          year={year}
          version={version}
        />
        <SearchBudgetTrend
          keywords={keywords}
          yearTotals={yearTotals}
          version={version}
        />
      </div>
      <div>
        <BudgetListSection
          tags={tags}
          year={year}
          version={version}
          data={displayBudgetList}
        />
      </div>
      <div>
        <BudgetMinistryListSection
          keywords={keywords}
          year={year}
          version={version}
          data={ministryData}
        />
      </div>
    </div>
  );
}
