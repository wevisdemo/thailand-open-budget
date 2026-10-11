import type { BudgetItem, BudgetYearTotal } from "@/types/budget";
import type { OrganizationYearTotal } from "@/types/organization";
import type {
  CoreContentBlock,
  CoreContentField,
  RelatedDocument,
} from "@/types/ministry";

export const CORE_CONTENT_TABS: { field: CoreContentField; label: string }[] = [
  { field: "vision", label: "วิสัยทัศน์" },
  { field: "mission", label: "พันธกิจ" },
  { field: "objective", label: "วัตถุประสงค์" },
];

// An item marker at the start of a line: "1." or "(1)" or "1)".
const LIST_MARKER = /^(?:\(\d+\)|\d+[.)])\s*/;

// Reads a CoreContent cell. The sheet numbers its lists either "1." or "(1)";
// a line without a marker continues the item above it. A cell with no markers
// at all is plain text.
export function parseCoreContent(text: string): CoreContentBlock {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.some((line) => LIST_MARKER.test(line))) {
    return { kind: "text", text: lines.join("\n") };
  }

  const items: string[] = [];
  for (const line of lines) {
    if (LIST_MARKER.test(line) || items.length === 0) {
      items.push(line.replace(LIST_MARKER, ""));
    } else {
      items[items.length - 1] += ` ${line}`;
    }
  }
  return { kind: "list", items };
}

const THAI_DIGITS = "๐๑๒๓๔๕๖๗๘๙";

// "เล่มที่ ๑๕" -> "เล่มที่ 15"
export function toArabicDigits(text: string): string {
  return text.replace(/[๐-๙]/g, (digit) => String(THAI_DIGITS.indexOf(digit)));
}

// The document volumes a set of items is printed in, one link each, in volume
// order: เล่มที่ 3 < 3(1) < 3(4) < 15. The link opens the PDF itself: the
// items' page_url minus the `?#page=` that points at their row.
export function getRelatedDocuments(items: BudgetItem[]): RelatedDocument[] {
  const documents = new Map<string, string>();
  for (const item of items) {
    if (!item.pdf_name || documents.has(item.pdf_name)) continue;
    documents.set(item.pdf_name, item.page_url.replace(/\??#.*$/, ""));
  }
  return [...documents]
    .map(([name, url]) => ({ name: toArabicDigits(name), url }))
    .sort((a, b) => a.name.localeCompare(b.name, "th", { numeric: true }));
}

// A ministry's total and the country's for one year's organization file, in
// the shape the budget proportion and trend cards take.
export function getMinistryYearTotal(
  data: OrganizationYearTotal[],
  ministryId: number,
  year: number,
  isCurrent: boolean,
): BudgetYearTotal {
  let totalSelectedBaht = 0;
  let totalBudgetBaht = 0;
  for (const unit of data) {
    totalBudgetBaht += unit.budget_amount;
    if (unit.ministry_id === ministryId)
      totalSelectedBaht += unit.budget_amount;
  }
  return { year, isCurrent, totalSelectedBaht, totalBudgetBaht };
}
