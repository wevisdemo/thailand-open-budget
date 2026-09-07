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
