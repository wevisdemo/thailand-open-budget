"use client";

import { Dropdown } from "@carbon/react";
import type { BudgetBase } from "@/types/budget";
import { BUDGET_BASE_OPTIONS } from "@/constants/budget";

type BudgetBaseOption = (typeof BUDGET_BASE_OPTIONS)[number];

interface BudgetBaseSelectProps {
  id: string;
  base: BudgetBase;
  onChange: (base: BudgetBase) => void;
}

// "% ของ [งบฯ ประเทศ]": picks the budget a share is measured against.
export default function BudgetBaseSelect({
  id,
  base,
  onChange,
}: BudgetBaseSelectProps) {
  return (
    <div className="flex items-center gap-[8px]">
      <label htmlFor={id} className="shrink-0 text-[16px] font-bold">
        % ของ
      </label>
      <Dropdown<BudgetBaseOption>
        id={id}
        titleText="% ของ"
        hideLabel
        label="งบฯ ประเทศ"
        size="sm"
        items={BUDGET_BASE_OPTIONS}
        itemToString={(option) => option?.label ?? ""}
        selectedItem={BUDGET_BASE_OPTIONS.find((o) => o.value === base)}
        onChange={({ selectedItem }) => {
          if (selectedItem) onChange(selectedItem.value);
        }}
        className="w-[160px] [&_.cds--list-box\_\_label]:font-bold"
      />
    </div>
  );
}
