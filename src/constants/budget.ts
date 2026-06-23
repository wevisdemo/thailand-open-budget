export type DocSourceValue = "2568-draft-1" | "2569-draft-1";

// Maps dropdown value → public/data/ JSON filename (without .json)
export const DOC_SOURCE_DATA_FILE: Record<DocSourceValue, string> = {
  "2568-draft-1": "budget_2568_drafted",
  "2569-draft-1": "budget_2569_drafted",
};

export const DOC_SOURCE_OPTIONS: { value: DocSourceValue; label: string }[] = [
  { value: "2568-draft-1", label: "2568 ฉบับร่าง (วาระ 1)" },
  { value: "2569-draft-1", label: "2569 ฉบับร่าง (วาระ 1)" },
  // { value: "2569-approved-3", label: "2569 สภาอนุมัติแล้ว (วาระ 3)" },
];
