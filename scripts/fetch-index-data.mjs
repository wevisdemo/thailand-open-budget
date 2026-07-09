#!/usr/bin/env node
/**
 * Downloads the budget document index sheet and saves it as JSON to
 * src/app/data/budget_index.json.
 *
 * The index lists every budget document (year, names, status, source links)
 * and is small enough to import statically at build time.
 *
 * The spreadsheet must be shared with "Anyone with the link" (Viewer).
 * No API key required.
 *
 * Usage:
 *   node scripts/fetch-index-data.mjs
 */

import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { SPREADSHEET_ID, INDEX_GID } from "./constants.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const OUT_DIR = join(__dirname, "..", "src", "app", "data");
const OUT_FILE = join(OUT_DIR, "budget_index.json");

async function fetchCSV() {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${INDEX_GID}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch index sheet (${res.status}). Make sure the spreadsheet is shared with "Anyone with the link".`,
    );
  }
  return res.text();
}

function parseRow(line) {
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
}

function parseCSV(csv) {
  const lines = csv.split(/\r?\n/).filter((l) => l.trim());
  const [headerLine, ...dataLines] = lines;
  const headers = parseRow(headerLine);

  const idx = Object.fromEntries(headers.map((h, i) => [h, i]));
  const orNull = (v) => (v ? v : null);

  return dataLines.map((line) => {
    const row = parseRow(line);
    return {
      year: Number(row[idx.year]) || 0,
      nick_name: row[idx.nick_name] || "",
      full_name: row[idx.full_name] || "",
      status: row[idx.status] || "",
      updated_date: orNull(row[idx.updated_date]),
      source_url: orNull(row[idx.source_url]),
      csv_url: orNull(row[idx.csv_url]),
    };
  });
}

async function main() {
  console.log("Fetching index sheet...");
  const csv = await fetchCSV();

  console.log("Parsing CSV...");
  const data = parseCSV(csv);
  console.log(`Rows parsed: ${data.length}`);

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(data, null, 2) + "\n");

  console.log(`Saved → ${OUT_FILE}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
