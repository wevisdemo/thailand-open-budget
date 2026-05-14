export type DocSourceValue =
  | "2566-draft-1"
  | "2567-draft-1"
  | "2568-draft-1"
  | "2569-draft-1"
  | "2569-approved-3";

// Maps dropdown value → public/data/ JSON filename (without .json)
export const DOC_SOURCE_DATA_FILE: Record<DocSourceValue, string> = {
  "2566-draft-1": "budget_2566_drafted",
  "2567-draft-1": "budget_2567_drafted",
  "2568-draft-1": "budget_2568_drafted",
  "2569-draft-1": "budget_2569_drafted",
  "2569-approved-3": "budget_2569_approved",
};
