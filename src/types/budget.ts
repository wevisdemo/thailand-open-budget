export interface BudgetItem {
  fiscal_year: string;
  ministry: string;
  budgetary: string;
  plan: string;
  project: string;
  category: string;
  description: string;
  amount: number;
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
