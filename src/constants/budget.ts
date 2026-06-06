export type DocSourceValue = "2568-draft-1" | "2569-draft-1";

// Maps dropdown value → public/data/ JSON filename (without .json)
export const DOC_SOURCE_DATA_FILE: Record<DocSourceValue, string> = {
  "2568-draft-1": "budget_2568_drafted",
  "2569-draft-1": "budget_2569_drafted",
};
