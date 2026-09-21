export type OrganizationLevel = "ministry" | "budgetary";

export interface Organization {
  id: string;
  name: string;
  level: OrganizationLevel;
  // Parent ministry, shown as the sub label. Empty for ministry-level units,
  // which have no parent above them.
  ministry: string;
}

export interface OrganizationSuggestion {
  organization: Organization;
  // Inclusive [start, end] character ranges of `organization.name` that the
  // query matched, used to embolden the matched part of the label.
  matchIndices: [number, number][];
}

export interface OrganizationSuggestionGroup {
  level: OrganizationLevel;
  label: string;
  suggestions: OrganizationSuggestion[];
}

// One ministry/budgetary pair, from public/data/organizations.json. The ids
// are URL path segments on /organizations/[ministry_id]/[budgetary_id] and are
// allocated append-only, so they outlive the names they were minted from.
export interface OrganizationRegistryEntry {
  ministry_id: number;
  budgetary_id: number;
  // `${ministry_name}_${budgetary_name}`, spelled exactly as the source sheet
  // does — the key the budget documents are grouped by. Names that differ only
  // invisibly are distinct organizations here; see docs/organization-id-risks.md.
  key: string;
  ministry_name: string;
  budgetary_name: string;
}

// One budgetary unit's totals for a single fiscal year, from
// public/data/organization_<sheet>.json.
export interface OrganizationYearTotal {
  budgetary_id: number;
  budgetary_name: string;
  ministry_id: number;
  ministry_name: string;
  budget_amount: number;
  // Null when the previous year's document is missing, or when the unit had no
  // allocation that year.
  previous_year_amount: number | null;
  // `previous_year_amount` as a share of the previous year's grand total, 0-100.
  previous_year_percent: number | null;
}
