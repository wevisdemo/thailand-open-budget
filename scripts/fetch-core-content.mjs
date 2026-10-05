#!/usr/bin/env node
/**
 * Downloads the CoreContent sheet — each organization's vision, mission and
 * objectives — and saves it keyed by the ids in public/data/organizations.json.
 *
 * Writes:
 *
 *   src/app/data/ministry_core_content.json     keyed by ministry_id, small
 *                                               enough to import statically
 *   public/data/budgetary_core_content.json     keyed by budgetary_id, fetched
 *                                               at runtime
 *
 * Only organizations with at least one field filled in are written; a missing
 * id means the sheet has nothing for it. Rows are joined to the registry by
 * name, so run `pnpm data:organizations` first.
 *
 * The spreadsheet must be shared with "Anyone with the link" (Viewer).
 * No API key required.
 *
 * Usage:
 *   node scripts/fetch-core-content.mjs
 *   pnpm data:core
 */

import { readFileSync, existsSync } from "fs";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { SPREADSHEET_ID, CORE_CONTENT_GID } from "./constants.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REGISTRY_FILE = join(ROOT, "public", "data", "organizations.json");
const MINISTRY_OUT_FILE = join(
  ROOT,
  "src",
  "app",
  "data",
  "ministry_core_content.json",
);
const BUDGETARY_OUT_FILE = join(
  ROOT,
  "public",
  "data",
  "budgetary_core_content.json",
);

async function fetchCSV() {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${CORE_CONTENT_GID}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch CoreContent sheet (${res.status}). Make sure the spreadsheet is shared with "Anyone with the link".`,
    );
  }
  return res.text();
}

/**
 * Parses the whole CSV at once rather than line by line: the mission and
 * objective cells are numbered lists with line breaks inside the quotes.
 */
function parseCSV(csv) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQuote = false;

  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (inQuote) {
      if (ch === '"' && csv[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuote = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuote = true;
    } else if (ch === ",") {
      row.push(cur);
      cur = "";
    } else if (ch === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (ch !== "\r") {
      cur += ch;
    }
  }
  if (cur || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }

  const [headers, ...dataRows] = rows;
  const idx = Object.fromEntries(headers.map((h, i) => [h.trim(), i]));
  const orNull = (v) => (v && v.trim() ? v.trim() : null);

  return dataRows.map((cells) => ({
    name: (cells[idx.OGR] || "").trim(),
    unit: (cells[idx.UNIT] || "").trim(),
    vision: orNull(cells[idx.VISION]),
    mission: orNull(cells[idx.MISSION]),
    objective: orNull(cells[idx.OBJECTIVE]),
  }));
}

/**
 * Keys rows by registry id. A name the registry does not know, or a second
 * row for an id already filled, is reported and skipped.
 */
function keyById(rows, idsByName, label) {
  const out = {};
  const unknown = [];
  const duplicates = [];

  for (const { name, vision, mission, objective } of rows) {
    if (!vision && !mission && !objective) continue;
    const id = idsByName.get(name);
    if (id === undefined) {
      unknown.push(name);
      continue;
    }
    if (out[id]) {
      duplicates.push(name);
      continue;
    }
    out[id] = { vision, mission, objective };
  }

  if (unknown.length > 0) {
    console.warn(
      `Warning: ${unknown.length} ${label} not in organizations.json, skipped: ${unknown.join(", ")}`,
    );
  }
  if (duplicates.length > 0) {
    console.warn(
      `Warning: ${duplicates.length} duplicate ${label} rows, kept the first: ${duplicates.join(", ")}`,
    );
  }
  return out;
}

async function main() {
  if (!existsSync(REGISTRY_FILE)) {
    throw new Error(
      "public/data/organizations.json not found. Run `pnpm data:import` first.",
    );
  }
  const registry = JSON.parse(readFileSync(REGISTRY_FILE));
  const ministryIds = new Map(
    registry.map((e) => [e.ministry_name, e.ministry_id]),
  );
  const budgetaryIds = new Map(
    registry.map((e) => [e.budgetary_name, e.budgetary_id]),
  );

  console.log("Fetching CoreContent sheet...");
  const rows = parseCSV(await fetchCSV());
  console.log(`Rows parsed: ${rows.length}`);

  const ministries = keyById(
    rows.filter((r) => r.unit === "MINISTRY"),
    ministryIds,
    "ministries",
  );
  const budgetaries = keyById(
    rows.filter((r) => r.unit === "BUDGETARY_UNIT"),
    budgetaryIds,
    "budgetary units",
  );

  await mkdir(dirname(MINISTRY_OUT_FILE), { recursive: true });
  await writeFile(
    MINISTRY_OUT_FILE,
    JSON.stringify(ministries, null, 2) + "\n",
  );
  console.log(
    `Saved → ${MINISTRY_OUT_FILE} (${Object.keys(ministries).length} ministries)`,
  );

  await writeFile(BUDGETARY_OUT_FILE, JSON.stringify(budgetaries));
  console.log(
    `Saved → ${BUDGETARY_OUT_FILE} (${Object.keys(budgetaries).length} budgetary units)`,
  );
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
