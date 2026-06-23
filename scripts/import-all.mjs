#!/usr/bin/env node
/**
 * Imports all budget sheets and saves them to public/data/.
 * Runs each sheet sequentially to avoid hammering the Google Sheets export API.
 *
 * Usage:
 *   node scripts/import-all.mjs
 *   pnpm data:import
 */

import { execSync } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { SHEET_GID_MAP } from "./constants.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fetchScript = join(__dirname, "fetch-budget-data.mjs");

const SHEETS = Object.keys(SHEET_GID_MAP);

for (const sheet of SHEETS) {
  console.error(`\n=== Importing ${sheet} ===`);
  try {
    execSync(`node ${fetchScript} ${sheet}`, { stdio: "inherit" });
  } catch {
    console.error(
      `Failed to import ${sheet}. Continuing with remaining sheets.`,
    );
  }
}

console.error("\nDone.");
