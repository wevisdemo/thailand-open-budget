"use client";

import type { BudgetItem, BudgetMinistryItem } from "@/types/budget";
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
}

export default function SearchBody({
  totalBudgetAmount,
  displayBudgetList,
  ministryData,
  tags,
}: SearchBodyProps) {
  const keywords = tags.map((t) => t.word);

  const totalDisplayBudget = displayBudgetList.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  return (
    <div className="content-container flex flex-col gap-[24px]">
      <div className="flex flex-col gap-[32px] md:flex-row">
        <SearchBudgetProportion
          keywords={keywords}
          filteredBudget={totalDisplayBudget}
          totalBudget={totalBudgetAmount}
        />
        <SearchBudgetTrend keywords={keywords} />
      </div>
      <div>
        <BudgetListSection
          tags={tags}
          year={2569}
          version="ฉบับร่าง"
          data={displayBudgetList}
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
