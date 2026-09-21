#!/usr/bin/env node
/**
 * Builds the organization data from the downloaded budget documents.
 *
 * Writes to public/data/:
 *
 *   organizations.json                  the id registry, one entry per
 *                                       ministry/budgetary pair ever seen
 *   organization_<sheet>.json           per fiscal year, one entry per
 *                                       budgetary unit with its totals
 *   budget_<sheet>.json                 rewritten in place, with ministry_id
 *                                       and budgetary_id stamped onto each row
 *
 * The ids can only be stamped once the registry exists, so `pnpm data:fetch`
 * on its own leaves a budget file without them; this script backfills it.
 *
 * The registry is APPEND-ONLY. Existing ids are never reassigned and entries
 * are never dropped, because they are URL path segments on
 * /organizations/<ministry_id>/<budgetary_id>. A unit that disappears from a
 * later document keeps its id and its page — older fiscal years still
 * reference it. Delete public/data/organizations.json only if you intend to
 * break every organization URL.
 *
 * Run `pnpm data:import` first; this script reads what that wrote.
 *
 * Usage:
 *   node scripts/build-organizations.mjs
 *   pnpm data:organizations
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  SHEET_GID_MAP,
  organizationKey,
  previousSheetName,
} from "./constants.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "public", "data");
const REGISTRY_FILE = join(DATA_DIR, "organizations.json");

// Oldest first, so ids are allocated in fiscal-year order.
const SHEETS = Object.keys(SHEET_GID_MAP).sort();

const budgetFile = (sheet) => join(DATA_DIR, `budget_${sheet}.json`);

function loadBudget(sheet) {
  const file = budgetFile(sheet);
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file));
}

/**
 * Sums `amount` per ministry/budgetary pair, keyed the same way the registry
 * is. Also returns the document's grand total, which previous_year_percent is
 * a share of.
 */
function totalsByOrganization(rows) {
  const totals = new Map();
  let grandTotal = 0;
  for (const row of rows) {
    if (!row.budgetary) continue;
    const key = organizationKey(row.ministry || "", row.budgetary);
    totals.set(key, (totals.get(key) || 0) + row.amount);
    grandTotal += row.amount;
  }
  return { totals, grandTotal };
}

/**
 * Loads the existing registry and indexes it by key. Ids already handed out
 * stay with their key; everything else is appended after the highest id in
 * use, so a rerun is additive even when a document is re-imported.
 */
function loadRegistry() {
  if (!existsSync(REGISTRY_FILE)) {
    return {
      entries: [],
      byKey: new Map(),
      ministryIds: new Map(),
      nextMinistryId: 1,
      nextBudgetaryId: 1,
    };
  }

  const entries = JSON.parse(readFileSync(REGISTRY_FILE));
  const byKey = new Map(entries.map((e) => [e.key, e]));
  const ministryIds = new Map(
    entries.map((e) => [e.ministry_name, e.ministry_id]),
  );
  return {
    entries,
    byKey,
    ministryIds,
    nextMinistryId: Math.max(0, ...entries.map((e) => e.ministry_id)) + 1,
    nextBudgetaryId: Math.max(0, ...entries.map((e) => e.budgetary_id)) + 1,
  };
}

function buildRegistry(documents) {
  const registry = loadRegistry();
  const existingCount = registry.entries.length;
  const added = [];

  for (const { sheet, rows } of documents) {
    for (const row of rows) {
      if (!row.budgetary) continue;

      const ministryName = row.ministry || "";
      const key = organizationKey(ministryName, row.budgetary);
      if (registry.byKey.has(key)) continue;

      if (!registry.ministryIds.has(ministryName)) {
        registry.ministryIds.set(ministryName, registry.nextMinistryId++);
      }

      const entry = {
        ministry_id: registry.ministryIds.get(ministryName),
        budgetary_id: registry.nextBudgetaryId++,
        key,
        ministry_name: ministryName,
        budgetary_name: row.budgetary,
      };
      registry.byKey.set(key, entry);
      registry.entries.push(entry);
      added.push({ sheet, entry });
    }
  }

  return { registry, existingCount, added };
}

function buildYearFile(rows, previousRows, registryByKey) {
  const { totals } = totalsByOrganization(rows);
  const previous = previousRows ? totalsByOrganization(previousRows) : null;

  return [...totals.entries()].map(([key, amount]) => {
    const entry = registryByKey.get(key);
    const previousAmount = previous?.totals.get(key) ?? null;

    return {
      budgetary_id: entry.budgetary_id,
      budgetary_name: entry.budgetary_name,
      ministry_id: entry.ministry_id,
      ministry_name: entry.ministry_name,
      budget_amount: amount,
      previous_year_amount: previousAmount,
      previous_year_percent:
        previousAmount === null || !previous.grandTotal
          ? null
          : Number(((previousAmount / previous.grandTotal) * 100).toFixed(6)),
    };
  });
}

/**
 * Copies each row with its organization's ids inserted next to the names they
 * were minted from. Returns null when every row is already stamped correctly,
 * so an unchanged document is not rewritten.
 */
function stampIds(rows, registryByKey) {
  let changed = false;

  const stamped = rows.map((row) => {
    const entry = row.budgetary
      ? registryByKey.get(organizationKey(row.ministry || "", row.budgetary))
      : null;
    const ministryId = entry ? entry.ministry_id : null;
    const budgetaryId = entry ? entry.budgetary_id : null;

    if (row.ministry_id !== ministryId || row.budgetary_id !== budgetaryId) {
      changed = true;
    }

    const { ministry, budgetary, ...rest } = row;
    return {
      ministry,
      ministry_id: ministryId,
      budgetary,
      budgetary_id: budgetaryId,
      ...rest,
    };
  });

  return changed ? stamped : null;
}

function main() {
  const documents = [];
  const bySheet = new Map();
  for (const sheet of SHEETS) {
    const rows = loadBudget(sheet);
    if (!rows) {
      console.warn(`Skipping ${sheet}: ${budgetFile(sheet)} not found.`);
      continue;
    }
    documents.push({ sheet, rows });
    bySheet.set(sheet, rows);
  }

  if (documents.length === 0) {
    throw new Error(
      "No budget documents in public/data/. Run `pnpm data:import` first.",
    );
  }

  const { registry, existingCount, added } = buildRegistry(documents);
  writeFileSync(REGISTRY_FILE, JSON.stringify(registry.entries));
  console.error(
    `organizations.json: ${registry.entries.length} entries (${existingCount} kept, ${added.length} added), ` +
      `${registry.nextMinistryId - 1} ministries`,
  );

  for (const { sheet, rows } of documents) {
    const previousSheet = previousSheetName(sheet);
    const previousRows = previousSheet
      ? (bySheet.get(previousSheet) ?? loadBudget(previousSheet))
      : null;

    const data = buildYearFile(rows, previousRows, registry.byKey);
    const outFile = join(DATA_DIR, `organization_${sheet}.json`);
    writeFileSync(outFile, JSON.stringify(data));

    const withPrevious = data.filter(
      (d) => d.previous_year_amount !== null,
    ).length;
    const sizeKB = Buffer.byteLength(JSON.stringify(data)) / 1024;
    console.error(
      `organization_${sheet}.json: ${data.length} units, ` +
        (previousRows
          ? `${withPrevious} with ${previousSheet} figures, ${data.length - withPrevious} new`
          : `no ${previousSheet} document, previous_year_amount null throughout`) +
        ` (${sizeKB.toFixed(0)} KB)`,
    );
  }

  for (const { sheet, rows } of documents) {
    const stamped = stampIds(rows, registry.byKey);
    if (!stamped) {
      console.error(`budget_${sheet}.json: ids already current, not rewritten`);
      continue;
    }
    const unmatched = stamped.filter((row) => row.budgetary_id === null).length;
    writeFileSync(budgetFile(sheet), JSON.stringify(stamped));
    console.error(
      `budget_${sheet}.json: stamped ${stamped.length - unmatched} rows` +
        (unmatched ? `, ${unmatched} with no budgetary unit` : ""),
    );
  }
}

main();
