export interface BudgetItem {
  id: string;
  ministry: string;
  budgetary: string;
  plan: string;
  crossFunc: boolean;
  output: string;
  project: string;
  category: string;
  categoryLv2: string;
  description: string;
  amount: number;
  year: number;
  obliged: boolean;
}

export interface BudgetMinistryItem {
  id: string;
  ministry: string;
  amount: number;
  budgetary: string;
  budgetPercentage: number;
}
