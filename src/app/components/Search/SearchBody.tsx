"use client";

import { useState } from "react";
import SearchBudgetProportion from "./SearchBudgetProportion";

export default function SearchBody() {
  const [keywords, setKeywords] = useState<string[]>(["น้ำท่วม", "ขอนแก่น"]);

  return (
    <div className="content-container flex flex-col gap-[24px]">
      <div className="flex">
        <SearchBudgetProportion
          keywords={keywords}
          filteredBudget={1000000}
          totalBudget={4000000}
        />
      </div>
    </div>
  );
}
