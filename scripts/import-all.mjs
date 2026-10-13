#!/usr/bin/env node
/**
 * Imports all budget sheets and saves them to public/data/, then rebuilds the
 * organization registry and per-year organization files from them, splits
 * each budget by ministry, and finally fetches each organization's core
 * content keyed by that registry.
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
const organizationsScript = join(__dirname, "build-organizations.mjs");
const coreContentScript = join(__dirname, "fetch-core-content.mjs");
const splitScript = join(__dirname, "split-budget-by-ministry.mjs");

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

console.error("\n=== Building organizations ===");
execSync(`node ${organizationsScript}`, { stdio: "inherit" });

console.error("\n=== Splitting budgets by ministry ===");
execSync(`node ${splitScript}`, { stdio: "inherit" });

console.error("\n=== Fetching core content ===");
execSync(`node ${coreContentScript}`, { stdio: "inherit" });

console.error("\nDone.");
