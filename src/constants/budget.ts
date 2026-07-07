export type DocSourceValue = "2568-draft-1" | "2569-draft-1" | "2570-draft-1";

// Maps dropdown value → public/data/ JSON filename (without .json)
export const DOC_SOURCE_DATA_FILE: Record<DocSourceValue, string> = {
  "2568-draft-1": "budget_2568_drafted",
  "2569-draft-1": "budget_2569_drafted",
  "2570-draft-1": "budget_2570_drafted",
};

export const DOC_SOURCE_OPTIONS: { value: DocSourceValue; label: string }[] = [
  { value: "2568-draft-1", label: "2568 ฉบับร่าง (วาระ 1)" },
  { value: "2569-draft-1", label: "2569 ฉบับร่าง (วาระ 1)" },
  { value: "2570-draft-1", label: "2570 ฉบับร่าง (วาระ 1)" },
  // { value: "2569-approved-3", label: "2569 สภาอนุมัติแล้ว (วาระ 3)" },
];

// Converts a doc source value's leading Buddhist-era year to its Gregorian
// fiscal year, e.g. "2568-draft-1" -> "2025", to match BudgetItem.fiscal_year.
export function getFiscalYear(docSource: DocSourceValue): string {
  return (parseInt(docSource) - 543).toString();
}
