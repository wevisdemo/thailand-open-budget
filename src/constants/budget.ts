import type {
  BudgetBase,
  BudgetItem,
  BudgetSort,
  BudgetSortKey,
} from "@/types/budget";

export type DocSourceValue =
  | "2568-draft-1"
  | "2569-draft-1"
  | "2570-draft-1"
  | "2569-approved-3"
  | "2570-approved-3";

// Maps dropdown value → data/ JSON filename (without .json)
export const DOC_SOURCE_DATA_FILE: Record<DocSourceValue, string> = {
  "2568-draft-1": "budget_2568_drafted",
  "2569-draft-1": "budget_2569_drafted",
  "2570-draft-1": "budget_2570_drafted",
  "2569-approved-3": "budget_2569_bill",
  "2570-approved-3": "budget_2570_bill",
};

// A document's sheet name, e.g. "2570-draft-1" -> "2570_drafted": what its
// data files are named after.
export function getDocSourceSheet(docSource: DocSourceValue): string {
  return DOC_SOURCE_DATA_FILE[docSource].replace(/^budget_/, "");
}

export const DOC_SOURCE_OPTIONS: { value: DocSourceValue; label: string }[] = [
  { value: "2568-draft-1", label: "2568 ฉบับร่าง (วาระ 1)" },
  { value: "2569-draft-1", label: "2569 ฉบับร่าง (วาระ 1)" },
  { value: "2569-approved-3", label: "2569 สภาอนุมัติแล้ว (วาระ 3)" },
  { value: "2570-draft-1", label: "2570 ฉบับร่าง (วาระ 1)" },
  { value: "2570-approved-3", label: "2570 สภาอนุมัติแล้ว (วาระ 3)" },
];

// The stage of a document: its value without the year, e.g.
// "2569-approved-3" -> "approved-3", "2568-draft-1" -> "draft-1".
function getStage(docSource: DocSourceValue): string {
  return docSource.slice(docSource.indexOf("-") + 1);
}

// The document of `year` in exactly the stage of `docSource`, with no
// fallback: null when that stage has none, e.g. approved 2568. The trend
// shows one stage's set, so a year without that stage has no point.
export function getStageDocSource(
  year: number,
  docSource: DocSourceValue,
): DocSourceValue | null {
  const stage = getStage(docSource);
  return (
    DOC_SOURCE_OPTIONS.find((o) => o.value === `${year}-${stage}`)?.value ??
    null
  );
}

// The document of `year` in the same stage as `docSource`, falling back to
// that year's draft when it has no document in that stage, e.g. approved
// 2568 -> draft 2568. Null for a year without data.
export function getDocSourceForYear(
  year: number,
  docSource: DocSourceValue,
): DocSourceValue | null {
  return (
    getStageDocSource(year, docSource) ??
    DOC_SOURCE_OPTIONS.find((o) => o.value === `${year}-draft-1`)?.value ??
    null
  );
}

// The document of the year before `docSource`, for changes from the
// previous year; null for the first year in the data.
export function getPreviousDocSource(
  docSource: DocSourceValue,
): DocSourceValue | null {
  return getDocSourceForYear(parseInt(docSource) - 1, docSource);
}

// The document a sheet name belongs to, e.g. "2570_drafted" ->
// "2570-draft-1". Only for names that came from getDocSourceSheet.
export function getDocSourceFromSheet(sheet: string): DocSourceValue {
  const docSource = DOC_SOURCE_OPTIONS.find(
    ({ value }) => getDocSourceSheet(value) === sheet,
  )?.value;
  if (!docSource) throw new Error(`No budget document for sheet ${sheet}`);
  return docSource;
}

// The document of the year before `docSource`, in exactly its stage: approved
// 2570 follows approved 2569, never a draft. Unit totals compare like with
// like, so a document without such a predecessor has no change to show.
export function getPreviousStageDocSource(
  docSource: DocSourceValue,
): DocSourceValue | null {
  return getStageDocSource(parseInt(docSource) - 1, docSource);
}

export const BUDGET_BASE_OPTIONS: { value: BudgetBase; label: string }[] = [
  { value: "country", label: "งบฯ ประเทศ" },
  { value: "ministry", label: "งบฯ กระทรวง" },
];

// Converts a doc source value's leading Buddhist-era year to its Gregorian
// fiscal year, e.g. "2568-draft-1" -> "2025", to match BudgetItem.fiscal_year.
export function getFiscalYear(docSource: DocSourceValue): string {
  return (parseInt(docSource) - 543).toString();
}

// Converts a BudgetItem fiscal year to its Buddhist-era label for display,
// e.g. "2025" -> "2568". The inverse of getFiscalYear.
export function toBuddhistYear(fiscalYear: string): string {
  return (parseInt(fiscalYear) + 543).toString();
}

// Label for an obliged item's span of fiscal years, e.g. "2568-2573".
// Returns null when the item is committed to a single year only.
export function getObligedYearRange(fiscalYearList: string[]): string | null {
  if (fiscalYearList.length < 2) return null;
  const first = toBuddhistYear(fiscalYearList[0]);
  const last = toBuddhistYear(fiscalYearList[fiscalYearList.length - 1]);
  return `${first}-${last}`;
}

// The full แผนงาน name. The sheet splits it into a prefix (the plan's type,
// e.g. แผนงานบูรณาการ) and the suffix naming the plan itself; joined they are
// the plan name verbatim.
export function getPlanName(item: BudgetItem): string {
  return item.plan_prefix + item.plan_suffix;
}

// The text a sortable column shows, so its order matches what the reader sees:
// โครงการ/ผลผลิต falls back to `output`, แผนงาน reads as prefix + suffix.
function getSortText(item: BudgetItem, sortKey: BudgetSortKey): string {
  if (sortKey === "project") return item.project || item.output;
  if (sortKey === "plan") return getPlanName(item);
  return item.category;
}

// Unsorted rows keep the order they have in the budget document.
export function sortBudgetItems(
  data: BudgetItem[],
  sort: BudgetSort | null,
): BudgetItem[] {
  if (!sort) return data;

  const { key } = sort;
  const dir = sort.dir === "desc" ? -1 : 1;
  return [...data].sort((a, b) => {
    if (key === "amount") return (a.amount - b.amount) * dir;
    return getSortText(a, key).localeCompare(getSortText(b, key), "th") * dir;
  });
}

// Every header cycles through the same three states: ascending, descending, off.
export function getNextSort(
  clickedKey: BudgetSortKey,
  sort: BudgetSort | null,
): BudgetSort | null {
  if (sort?.key !== clickedKey) return { key: clickedKey, dir: "asc" };
  if (sort.dir === "asc") return { key: clickedKey, dir: "desc" };
  return null;
}
