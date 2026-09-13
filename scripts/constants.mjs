export const SPREADSHEET_ID = "1OfQIUzd82a5A_WpMk88-1G-dmsYI-8naJHtg7_1LSZg";

// Index sheet listing every budget document (year, names, status, source links).
export const INDEX_GID = "202026454";

export const SHEET_GID_MAP = {
  "2568_drafted": "321838122",
  "2569_drafted": "2114899200",
  "2570_drafted": "753923495",
};

export const COLUMN_MAP = {
  MINISTRY: "ministry",
  BUDGETARY_UNIT: "budgetary",
  BUDGET_PLAN: "plan",
  BUDGET_PLAN_PREFIX: "plan_prefix",
  BUDGET_PLAN_SUFFIX: "plan_suffix",
  OUTPUT: "output",
  PROJECT: "project",
  CATEGORY_LV1: "category",
  ITEM_DESCRIPTION: "description",
  AMOUNT: "amount",
  FISCAL_YEAR: "fiscal_year",
  "OBLIGED?": "obliged",
};

// Fields that must match for two obliged rows to be treated as the same item
// spread across fiscal years.
export const OBLIGED_KEY_FIELDS = [
  "ministry",
  "budgetary",
  "plan",
  "output",
  "project",
  "category",
  "description",
];
