export interface BudgetItem {
  id: string;
  description: string;
  ministry: string;
  project: string;
  amount: number;
  year: number;
  category: string;
  plan: string;
  budgetary: string;
}

export interface BudgetMinistryItem {
  id: string;
  ministry: string;
  amount: number;
  budgetary: string;
  budgetPercentage: number;
}
