export interface BudgetItem {
  ministry: string;
  budgetary: string;
  plan: string;
  project: string;
  category: string;
  description: string;
  amount: number;
}

export interface BudgetMinistryItem {
  id: string;
  ministry: string;
  amount: number;
  budgetary: string;
  budgetPercentage: number;
}
