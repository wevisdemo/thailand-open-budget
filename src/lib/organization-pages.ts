import { readFileSync } from "fs";
import { join } from "path";
import type { BudgetItem } from "@/types/budget";
import type {
  BudgetaryPageData,
  MinistryPageData,
  OrganizationCoreContent,
  OrganizationEntry,
  OrganizationItemSummary,
} from "@/types/organization";
import type { TreemapGrouping, TreemapNode } from "@/types/treemap";
import { DOC_SOURCE_OPTIONS } from "@/constants/budget";
import { getRelatedDocuments } from "@/constants/ministry";
import { TREEMAP_GROUPINGS, buildTreemapTree } from "@/constants/treemap";
import {
  getMinistryItems,
  getOrganizations,
  getYearTotals,
} from "@/lib/budget-source";

// Build-time only: what the ministry and budgetary pages are built with. Each
// page carries every document's figures, so changing the year needs no
// download for anything but an item table.

type CoreContentFile = Record<string, OrganizationCoreContent>;

const coreContentCache = new Map<string, CoreContentFile>();

// src/app/data/<name>.json, read from disk rather than imported, so only each
// page's own entry ends up in it.
function getCoreContent(name: string, id: number) {
  let content = coreContentCache.get(name);
  if (!content) {
    const file = join(process.cwd(), "src", "app", "data", `${name}.json`);
    content = JSON.parse(readFileSync(file, "utf8")) as CoreContentFile;
    coreContentCache.set(name, content);
  }
  return content[id] ?? null;
}

// What the page shows of a document's items without listing them: their
// count, the volumes they're printed in, and the treemap's groups.
function summarizeItems(items: BudgetItem[]): OrganizationItemSummary {
  const trees = Object.fromEntries(
    TREEMAP_GROUPINGS.map((grouping) => [
      grouping.value,
      buildTreemapTree(items, grouping.value, grouping.rootLabel),
    ]),
  ) as Record<TreemapGrouping, TreemapNode>;
  return {
    itemCount: items.length,
    relatedDocuments: getRelatedDocuments(items),
    trees,
  };
}

// Every ministry with a unit budgeted in some document, one entry each, by id.
export function getMinistries(): { id: number; name: string }[] {
  const ministries = new Map<number, string>();
  for (const entry of getOrganizations()) {
    ministries.set(entry.ministry_id, entry.ministry_name);
  }
  return [...ministries]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.id - b.id);
}

// Every budgetary unit budgeted in some document. Units with no items in any
// document get no page.
export function getBudgetaries(): OrganizationEntry[] {
  return getOrganizations();
}

export function getMinistryPageData(ministryId: number): MinistryPageData {
  const years: MinistryPageData["years"] = {};
  for (const { value } of DOC_SOURCE_OPTIONS) {
    const { units, countryBudget } = getYearTotals(value);
    years[value] = {
      units: units.filter((unit) => unit.ministry_id === ministryId),
      countryBudget,
      ...summarizeItems(getMinistryItems(value, ministryId)),
    };
  }
  return {
    coreContent: getCoreContent("ministry_core_content", ministryId),
    years,
  };
}

export function getBudgetaryPageData(
  ministryId: number,
  budgetaryId: number,
): BudgetaryPageData {
  const years: BudgetaryPageData["years"] = {};
  for (const { value } of DOC_SOURCE_OPTIONS) {
    const { units, countryBudget } = getYearTotals(value);
    let ministryBudget = 0;
    for (const unit of units) {
      if (unit.ministry_id === ministryId) ministryBudget += unit.budget_amount;
    }
    const items = getMinistryItems(value, ministryId).filter(
      (item) => item.budgetary_id === budgetaryId,
    );
    years[value] = {
      unit: units.find((unit) => unit.budgetary_id === budgetaryId) ?? null,
      ministryBudget,
      countryBudget,
      ...summarizeItems(items),
    };
  }
  return {
    coreContent: getCoreContent("budgetary_core_content", budgetaryId),
    years,
  };
}
