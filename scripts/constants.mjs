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
  PAGE_URL: "page_url",
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

// The registry key for one ministry/budgetary pair, built from the names
// exactly as the source sheet spells them. The sheet does contain names that
// differ only in invisible ways (see docs/organization-id-risks.md) — those
// are deliberately left as distinct organizations here, pending a decision on
// how to reconcile them.
export function organizationKey(ministry, budgetary) {
  return `${ministry}_${budgetary}`;
}

// The sheet holding the fiscal year before `sheetName`, e.g.
// "2569_drafted" -> "2568_drafted". Returns null when the name carries no year.
export function previousSheetName(sheetName) {
  const match = sheetName.match(/^(\d{4})(_.*)$/);
  if (!match) return null;
  return `${Number(match[1]) - 1}${match[2]}`;
}
