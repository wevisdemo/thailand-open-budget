import type { RelatedDocument } from "@/types/ministry";
import type { TreemapGrouping, TreemapNode } from "@/types/treemap";

export type OrganizationLevel = "ministry" | "budgetary";

export interface Organization {
  id: string;
  name: string;
  level: OrganizationLevel;
  // Parent ministry, shown as the sub label. Empty for ministry-level units,
  // which have no parent above them.
  ministry: string;
  // The unit's page, /organizations/[ministry_id](/[budgetary_id]), without
  // the budget_source query.
  href: string;
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

// One ministry/budgetary pair, from data/organizations.json. The ids
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

// A budgetary unit and its ministry, as the budget items name them. The ids
// are stamped on the items from data/organizations.json, and are URL
// path segments on /organizations/[ministry_id]/[budgetary_id].
export interface OrganizationEntry {
  ministry_id: number;
  ministry_name: string;
  budgetary_id: number;
  budgetary_name: string;
}

// One budgetary unit's totals for a single fiscal year, summed from the budget
// items at build time (src/lib/budget-source.ts).
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

// One homepage highlight card: an organization picked out of a year's totals,
// the page it links to and the figure it leads with.
export interface OrganizationHighlight {
  id: string;
  title: string;
  name: string;
  href: string;
  value: string;
  unit: string;
}

// A ministry's budgetary units for one fiscal year, with the ministry's totals
// summed from them. Units are sorted by name, ก-ฮ.
export interface OrganizationMinistryGroup {
  ministry_id: number;
  ministry_name: string;
  budget_amount: number;
  // Null when none of its units has a previous-year amount.
  previous_year_amount: number | null;
  units: OrganizationYearTotal[];
}

export type OrganizationSortKey = "amount" | "change";

// The table's sort state. `null` is the third state of the header cycle: no
// column sorted, so groups keep their default order, by name ก-ฮ.
export interface OrganizationSort {
  key: OrganizationSortKey;
  dir: "asc" | "desc";
}

// An organization's vision, mission and objectives, from the CoreContent sheet,
// as written there: mission and objective are usually numbered lists, one item
// per line. Null when the sheet leaves the field blank.
export interface OrganizationCoreContent {
  vision: string | null;
  mission: string | null;
  objective: string | null;
}

// What an organization page shows of its items in one document, summed at
// build time. The items themselves are too many to build into every page:
// the item table loads them (src/hooks/useMinistryItems.ts).
export interface OrganizationItemSummary {
  itemCount: number;
  relatedDocuments: RelatedDocument[];
  // The treemap's groups, by grouping.
  trees: Record<TreemapGrouping, TreemapNode>;
}

// A ministry's figures for one document, built into its page.
export interface MinistryYearData extends OrganizationItemSummary {
  // The ministry's units budgeted in the document.
  units: OrganizationYearTotal[];
  countryBudget: number;
}

// Everything the ministry page shows but its item table, for every document,
// so changing the year needs no download for most of the page.
export interface MinistryPageData {
  coreContent: OrganizationCoreContent | null;
  // Keyed by doc source value.
  years: Record<string, MinistryYearData>;
}

// A budgetary unit's figures for one document, built into its page.
export interface BudgetaryYearData extends OrganizationItemSummary {
  // Null in a document that doesn't budget the unit.
  unit: OrganizationYearTotal | null;
  ministryBudget: number;
  countryBudget: number;
}

// Everything the budgetary page shows but its item table, for every document.
export interface BudgetaryPageData {
  coreContent: OrganizationCoreContent | null;
  // Keyed by doc source value.
  years: Record<string, BudgetaryYearData>;
}

// One unit's totals in a document, as the organizations page carries them:
// [budgetary_id, budgetary_name, ministry_id, budget_amount,
//  previous_year_amount]. The ministry's name is in
// OrganizationListData.ministryNames, and previous_year_percent is worked out
// from the previous document's country budget.
export type PackedOrganizationTotal = [
  number,
  string,
  number,
  number,
  number | null,
];

// Every unit's totals in every document, built into the organizations page.
// See src/lib/packed-organization-totals.ts.
export interface OrganizationListData {
  ministryNames: Record<string, string>;
  // Keyed by doc source value.
  years: Record<
    string,
    { units: PackedOrganizationTotal[]; countryBudget: number }
  >;
}
