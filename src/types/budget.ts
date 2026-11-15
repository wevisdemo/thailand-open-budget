export interface BudgetItem {
  fiscal_year: string;
  ministry: string;
  // Registry ids for this row's organization, joining to
  // public/data/organizations.json. Null only when the row names no budgetary
  // unit. Stamped by scripts/build-organizations.mjs, not by the fetch step.
  ministry_id: number | null;
  budgetary: string;
  budgetary_id: number | null;
  plan: string;
  plan_prefix: string;
  plan_suffix: string;
  output: string;
  project: string;
  category: string;
  // ["category_level1", "category_level2", ...]: the sheet's CATEGORY_LV*
  // columns, broadest first, up to the row's last filled level, e.g.
  // ["งบดำเนินงาน", "ค่าตอบแทน ใช้สอยและวัสดุ"]. Only on the items the
  // pages are built with (src/lib/budget-source.ts), never in the budget files
  // themselves.
  category_levels?: string[];
  description: string;
  amount: number;
  pdf_name: string;
  page_url: string;
  total_fiscal_amount: number;
  fiscal_year_list: string[];
}

// One budget item with its text swapped for indexes into
// PackedBudgetItems.strings, in this order:
// [ministry, ministry_id, budgetary, budgetary_id, plan, plan_prefix,
//  plan_suffix, output, project, category, category_levels, description,
//  amount, fiscal_year, pdf_name, page_url without its page number, the page
//  number, total_fiscal_amount, fiscal_year_list]
// category_levels and fiscal_year_list are each one string, joined.
export type PackedBudgetItem = [
  number,
  number | null,
  number,
  number | null,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number | null,
  number,
  number,
];

// A list of budget items, as the files `next build` writes hold them: the same
// names, plans and PDF links repeat on most items, so each is written once in
// `strings`. See src/lib/packed-budget-items.ts.
export interface PackedBudgetItems {
  strings: string[];
  items: PackedBudgetItem[];
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
  // Registry ids for the organization links. `ministry` above holds the unit's
  // name and `budgetary` its ministry's, so `budgetaryId` is the unit's id.
  ministryId: number | null;
  budgetaryId: number | null;
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

// The budget a share is measured against: the whole country's, or the
// ministry the measured unit belongs to.
export type BudgetBase = "country" | "ministry";
