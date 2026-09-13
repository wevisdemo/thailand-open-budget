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
import {
  SPREADSHEET_ID,
  SHEET_GID_MAP,
  COLUMN_MAP,
  OBLIGED_KEY_FIELDS,
} from "./constants.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const SHEET_NAME = process.argv[2] || "2568_drafted";
const OUT_DIR = join(__dirname, "..", "public", "data");
const OUT_FILE = join(OUT_DIR, `budget_${SHEET_NAME}.json`);

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

  return dataLines.map((line) => {
    const row = parseRow(line);
    return {
      ministry: row[colIndex.MINISTRY] || "",
      budgetary: row[colIndex.BUDGETARY_UNIT] || "",
      plan: row[colIndex.BUDGET_PLAN] || "",
      output: row[colIndex.OUTPUT] || "",
      project: row[colIndex.PROJECT] || "",
      category: row[colIndex.CATEGORY_LV1] || "",
      description: row[colIndex.ITEM_DESCRIPTION] || "",
      amount: Number(row[colIndex.AMOUNT]?.replace(/,/g, "")) || 0,
      fiscal_year: row[colIndex.FISCAL_YEAR] || "",
      obliged: (row[colIndex["OBLIGED?"]] || "").toUpperCase() === "TRUE",
    };
  });
}

/**
 * The fiscal year the sheet reports on, derived from its Buddhist-era name
 * ("2568_drafted" → "2025"). Falls back to the most common FISCAL_YEAR in the
 * sheet when the name carries no year.
 */
function resolveReportYear(sheetName, rows) {
  const buddhistYear = Number(sheetName.slice(0, 4));
  if (buddhistYear >= 2400 && buddhistYear <= 2700) {
    return String(buddhistYear - 543);
  }

  const counts = new Map();
  for (const row of rows) {
    counts.set(row.fiscal_year, (counts.get(row.fiscal_year) || 0) + 1);
  }
  const mode = [...counts].sort((a, b) => b[1] - a[1])[0];
  const year = mode ? mode[0] : "";
  console.warn(
    `Warning: no fiscal year in sheet name "${sheetName}". Falling back to the most common FISCAL_YEAR ("${year}").`,
  );
  return year;
}

/**
 * Obliged items (งบผูกพัน) are committed across several fiscal years and appear
 * as one row per year. Collapse each of those into a single row carrying the
 * report year's amount, the commitment total, and every year it spans.
 * Rows that are not obliged pass through untouched.
 */
function collapseObliged(rows, reportYear) {
  const groups = new Map();
  const order = [];

  rows.forEach((row, index) => {
    const key = row.obliged
      ? OBLIGED_KEY_FIELDS.map((field) => row[field]).join("\u001f")
      : `\u0000${index}`;

    let group = groups.get(key);
    if (!group) {
      group = { row, total: 0, reportYearAmount: 0, years: new Set() };
      groups.set(key, group);
      order.push(group);
    }

    group.total += row.amount;
    group.years.add(row.fiscal_year);
    if (row.fiscal_year === reportYear) group.reportYearAmount += row.amount;
  });

  return order.map(({ row, total, reportYearAmount, years }) => ({
    ministry: row.ministry,
    budgetary: row.budgetary,
    plan: row.plan,
    output: row.output,
    project: row.project,
    category: row.category,
    description: row.description,
    amount: row.obliged ? reportYearAmount : row.amount,
    fiscal_year: row.obliged ? reportYear : row.fiscal_year,
    total_fiscal_amount: total,
    fiscal_year_list: [...years].sort(),
  }));
}

async function main() {
  console.log(`Fetching sheet "${SHEET_NAME}"...`);
  const csv = await fetchCSV();

  console.log("Parsing CSV...");
  const rows = parseCSV(csv);
  console.log(`Rows parsed: ${rows.length}`);

  const reportYear = resolveReportYear(SHEET_NAME, rows);
  const collapsed = collapseObliged(rows, reportYear);
  console.log(
    `Report year ${reportYear}: collapsed ${rows.length - collapsed.length} obliged rows → ${collapsed.length} rows`,
  );

  // Rows belonging to another fiscal year are only there to carry an obliged
  // item's future or past instalments, which collapseObliged has already folded
  // into total_fiscal_amount. The saved file holds the report year alone.
  const data = collapsed.filter((row) => row.fiscal_year === reportYear);
  console.log(`Dropped ${collapsed.length - data.length} off-year rows`);

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(data));

  const sizeKB = Buffer.byteLength(JSON.stringify(data)) / 1024;
  console.log(`Saved → ${OUT_FILE} (${sizeKB.toFixed(0)} KB)`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
