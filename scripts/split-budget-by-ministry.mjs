#!/usr/bin/env node
/**
 * Splits each budget document by ministry, so the ministry and budgetary
 * pages download their own ministry's items instead of the whole country's.
 *
 * Writes public/data/budget_by_ministry/<sheet>/<ministry_id>.json: the rows
 * of budget_<sheet>.json whose ministry_id matches, unchanged. A budgetary
 * page loads its ministry's file and keeps its own rows.
 *
 * The output is generated, not committed (it is gitignored): it only copies
 * budget_<sheet>.json, which is. `pnpm dev` and `pnpm build` run this first,
 * and so does `pnpm data:import` after stamping the ids it splits by. See
 * docs/data-loading-options.md.
 *
 * Usage:
 *   node scripts/split-budget-by-ministry.mjs
 *   pnpm data:split
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { SHEET_GID_MAP } from "./constants.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "public", "data");
const OUT_DIR = join(DATA_DIR, "budget_by_ministry");

function splitSheet(sheet) {
  const file = join(DATA_DIR, `budget_${sheet}.json`);
  if (!existsSync(file)) {
    console.warn(`Skipping ${sheet}: budget_${sheet}.json not found.`);
    return;
  }
  const rows = JSON.parse(readFileSync(file));

  const byMinistry = new Map();
  for (const row of rows) {
    if (row.ministry_id == null) {
      throw new Error(
        `budget_${sheet}.json has rows without a ministry_id. Run \`pnpm data:organizations\` first.`,
      );
    }
    const list = byMinistry.get(row.ministry_id) ?? [];
    list.push(row);
    byMinistry.set(row.ministry_id, list);
  }

  const dir = join(OUT_DIR, sheet);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  let largest = 0;
  for (const [ministryId, list] of byMinistry) {
    const json = JSON.stringify(list);
    writeFileSync(join(dir, `${ministryId}.json`), json);
    largest = Math.max(largest, Buffer.byteLength(json));
  }
  console.error(
    `budget_by_ministry/${sheet}: ${rows.length} rows in ${byMinistry.size} files, ` +
      `largest ${(largest / 1024 / 1024).toFixed(1)} MB`,
  );
}

for (const sheet of Object.keys(SHEET_GID_MAP).sort()) splitSheet(sheet);
