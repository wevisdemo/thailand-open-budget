export interface BudgetItem {
  fiscal_year: string;
  ministry: string;
  budgetary: string;
  plan: string;
  plan_prefix: string;
  plan_suffix: string;
  output: string;
  project: string;
  category: string;
  description: string;
  amount: number;
  page_url: string;
  total_fiscal_amount: number;
  fiscal_year_list: string[];
}

export type BudgetSortKey = "amount" | "project" | "plan" | "category";

// The table's sort state. `null` is the third state of the header cycle: no
// column sorted, so there is no direction to hold either.
export interface BudgetSort {
  key: BudgetSortKey;
  dir: "asc" | "desc";
}

export interface BudgetYearTotal {
  year: number;
  isCurrent: boolean;
  totalSelectedBaht: number;
  totalBudgetBaht: number;
}

export interface BudgetMinistryItem {
  id: string;
  ministry: string;
  amount: number;
  budgetary: string;
  budgetPercentage: number;
}

export interface BudgetDocument {
  year: number;
  nick_name: string;
  full_name: string;
  status: string;
  updated_date: string | null;
  source_url: string | null;
  csv_url: string | null;
}
