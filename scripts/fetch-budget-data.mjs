#!/usr/bin/env node
/**
 * Downloads a sheet from the Thailand Open Budget spreadsheet and saves it
 * as compact JSON to public/data/.
 *
 * The spreadsheet must be shared with "Anyone with the link" (Viewer).
 * No API key required.
 *
 * Usage:
 *   node scripts/fetch-budget-data.mjs [sheet_name]
 *
 *   sheet_name defaults to "2568_drafted"
 *
 * Output:
 *   public/data/budget_<sheet_name>.json
 */

import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SPREADSHEET_ID = "1OfQIUzd82a5A_WpMk88-1G-dmsYI-8naJHtg7_1LSZg";
const SHEET_NAME = process.argv[2] || "2568_drafted";
const OUT_DIR = join(__dirname, "..", "public", "data");
const OUT_FILE = join(OUT_DIR, `budget_${SHEET_NAME}.json`);

// Columns to keep — strips REF_DOC and REF_PAGE_NO (large/unused)
const COLUMN_MAP = {
  MINISTRY: "ministry",
  BUDGETARY_UNIT: "budgetary",
  BUDGET_PLAN: "plan",
  "CROSS_FUNC?": "crossFunc",
  OUTPUT: "output",
  PROJECT: "project",
  CATEGORY_LV1: "category",
  CATEGORY_LV2: "categoryLv2",
  ITEM_DESCRIPTION: "description",
  AMOUNT: "amount",
  FISCAL_YEAR: "year",
  "OBLIGED?": "obliged",
};

const SHEET_GID_MAP = {
  "2568_drafted": "321838122",
  "2569_drafted": "2114899200",
};

async function fetchCSV() {
  const gid = SHEET_GID_MAP[SHEET_NAME];
  if (!gid) {
    throw new Error(`No gid for "${SHEET_NAME}". Add it to SHEET_GID_MAP.`);
  }
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${gid}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch sheet "${SHEET_NAME}" (${res.status}). Make sure the spreadsheet is shared with "Anyone with the link".`,
    );
  }
  return res.text();
}

function parseCSV(csv) {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim());

  const parseRow = (line) => {
    const cells = [];
    let cur = "";
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuote = !inQuote;
      } else if (ch === "," && !inQuote) {
        cells.push(cur.trim());
        cur = "";
      } else {
        cur += ch;
      }
    }
    cells.push(cur.trim());
    return cells;
  };

  const [headerLine, ...dataLines] = lines;
  const headers = parseRow(headerLine);

  const colIndex = Object.fromEntries(
    Object.keys(COLUMN_MAP).map((col) => [col, headers.indexOf(col)]),
  );

  const missing = Object.entries(colIndex)
    .filter(([, idx]) => idx === -1)
    .map(([col]) => col);

  if (missing.length > 0) {
    console.warn("Warning: columns not found in sheet:", missing.join(", "));
  }

  return dataLines
    .map((line, i) => {
      const row = parseRow(line);
      return {
        id: String(i + 1),
        ministry: row[colIndex.MINISTRY] || "",
        budgetary: row[colIndex.BUDGETARY_UNIT] || "",
        plan: row[colIndex.BUDGET_PLAN] || "",
        crossFunc: row[colIndex["CROSS_FUNC?"]] === "TRUE",
        output: row[colIndex.OUTPUT] || "",
        project: row[colIndex.PROJECT] || "",
        category: row[colIndex.CATEGORY_LV1] || "",
        categoryLv2: row[colIndex.CATEGORY_LV2] || "",
        description: row[colIndex.ITEM_DESCRIPTION] || "",
        amount: Number(row[colIndex.AMOUNT]?.replace(/,/g, "")) || 0,
        year: Number(row[colIndex.FISCAL_YEAR]) || 0,
        obliged: row[colIndex["OBLIGED?"]] === "TRUE",
      };
    })
    .filter((item) => item.amount > 0);
}

async function main() {
  console.log(`Fetching sheet "${SHEET_NAME}"...`);
  const csv = await fetchCSV();

  console.log("Parsing CSV...");
  const data = parseCSV(csv);
  console.log(`Rows with amount > 0: ${data.length}`);

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(data));

  const sizeKB = Buffer.byteLength(JSON.stringify(data)) / 1024;
  console.log(`Saved → ${OUT_FILE} (${sizeKB.toFixed(0)} KB)`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
