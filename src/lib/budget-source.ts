import { readFileSync } from "fs";
import { join } from "path";
import type { BudgetItem } from "@/types/budget";
import type {
  OrganizationEntry,
  OrganizationYearTotal,
} from "@/types/organization";
import {
  DOC_SOURCE_OPTIONS,
  type DocSourceValue,
  getDocSourceSheet,
  getPreviousStageDocSource,
} from "@/constants/budget";

// Build-time only: reads the budget documents from disk, so the pages and the
// data files `next build` writes are all built from budget_<sheet>.json alone.

const DATA_DIR = join(process.cwd(), "data");

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, "utf8"));
}

// data/category_levels/<sheet>.json: each distinct level path once,
// and each budget item as its path's index, in the budget file's order.
interface CategoryLevels {
  paths: string[][];
  rows: number[];
}

const itemsCache = new Map<DocSourceValue, BudgetItem[]>();

// A document's items, each with its budget category levels, which only the
// treemap's ประเภทงบ grouping uses.
export function getBudgetItems(docSource: DocSourceValue): BudgetItem[] {
  const cached = itemsCache.get(docSource);
  if (cached) return cached;

  const sheet = getDocSourceSheet(docSource);
  const items = readJson<BudgetItem[]>(join(DATA_DIR, `budget_${sheet}.json`));
  const levels = readJson<CategoryLevels>(
    join(DATA_DIR, "category_levels", `${sheet}.json`),
  );
  // The levels file is written alongside the budget file, so a different
  // count means one of them is stale.
  if (levels.rows.length !== items.length) {
    throw new Error(
      `category_levels/${sheet}.json has ${levels.rows.length} rows but budget_${sheet}.json has ${items.length}. Run \`pnpm data:import\` again.`,
    );
  }
  const withLevels = items.map((item, i) => ({
    ...item,
    category_levels: levels.paths[levels.rows[i]],
  }));
  itemsCache.set(docSource, withLevels);
  return withLevels;
}

const ministryItemsCache = new Map<DocSourceValue, Map<number, BudgetItem[]>>();

// A ministry's items in a document; empty when the document has none.
export function getMinistryItems(
  docSource: DocSourceValue,
  ministryId: number,
): BudgetItem[] {
  let byMinistry = ministryItemsCache.get(docSource);
  if (!byMinistry) {
    byMinistry = new Map();
    for (const item of getBudgetItems(docSource)) {
      if (item.ministry_id === null) continue;
      const list = byMinistry.get(item.ministry_id) ?? [];
      list.push(item);
      byMinistry.set(item.ministry_id, list);
    }
    ministryItemsCache.set(docSource, byMinistry);
  }
  return byMinistry.get(ministryId) ?? [];
}

// Each unit's summed amount, and the document's grand total that a previous
// year's share is measured against.
function sumByUnit(items: BudgetItem[]) {
  const amounts = new Map<number, number>();
  let grandTotal = 0;
  for (const item of items) {
    if (item.budgetary_id === null) continue;
    amounts.set(
      item.budgetary_id,
      (amounts.get(item.budgetary_id) ?? 0) + item.amount,
    );
    grandTotal += item.amount;
  }
  return { amounts, grandTotal };
}

export interface YearTotals {
  units: OrganizationYearTotal[];
  countryBudget: number;
}

const totalsCache = new Map<DocSourceValue, YearTotals>();

// Every unit's total in a document. previous_year_percent is the unit's
// previous-year amount as a share of the previous document's grand total.
export function getYearTotals(docSource: DocSourceValue): YearTotals {
  const cached = totalsCache.get(docSource);
  if (cached) return cached;

  const items = getBudgetItems(docSource);
  const { amounts, grandTotal } = sumByUnit(items);
  const previousDocSource = getPreviousStageDocSource(docSource);
  const previous = previousDocSource
    ? sumByUnit(getBudgetItems(previousDocSource))
    : null;

  const units = new Map<number, OrganizationYearTotal>();
  for (const item of items) {
    const { budgetary_id: budgetaryId, ministry_id: ministryId } = item;
    if (budgetaryId === null || ministryId === null || units.has(budgetaryId))
      continue;
    const previousAmount = previous?.amounts.get(budgetaryId) ?? null;
    units.set(budgetaryId, {
      budgetary_id: budgetaryId,
      budgetary_name: item.budgetary,
      ministry_id: ministryId,
      ministry_name: item.ministry,
      budget_amount: amounts.get(budgetaryId) ?? 0,
      previous_year_amount: previousAmount,
      previous_year_percent:
        previousAmount === null || !previous?.grandTotal
          ? null
          : Number(((previousAmount / previous.grandTotal) * 100).toFixed(6)),
    });
  }

  const totals = { units: [...units.values()], countryBudget: grandTotal };
  totalsCache.set(docSource, totals);
  return totals;
}

let organizations: OrganizationEntry[] | null = null;

// Every unit budgeted in at least one document, by id. A unit's names are
// the latest document's.
export function getOrganizations(): OrganizationEntry[] {
  if (organizations) return organizations;
  const byId = new Map<number, OrganizationEntry>();
  for (const { value } of DOC_SOURCE_OPTIONS) {
    for (const unit of getYearTotals(value).units) {
      byId.set(unit.budgetary_id, {
        ministry_id: unit.ministry_id,
        ministry_name: unit.ministry_name,
        budgetary_id: unit.budgetary_id,
        budgetary_name: unit.budgetary_name,
      });
    }
  }
  organizations = [...byId.values()].sort(
    (a, b) => a.budgetary_id - b.budgetary_id,
  );
  return organizations;
}
