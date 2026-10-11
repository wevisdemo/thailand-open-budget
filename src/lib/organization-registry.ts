import { readFileSync } from "fs";
import { join } from "path";
import type {
  OrganizationRegistryEntry,
  OrganizationYearTotal,
} from "@/types/organization";
import { DOC_SOURCE_DATA_FILE } from "@/constants/budget";

function readDataFile<T>(name: string): T {
  const file = join(process.cwd(), "public", "data", `${name}.json`);
  return JSON.parse(readFileSync(file, "utf8"));
}

let registry: OrganizationRegistryEntry[] | null = null;

// Build-time only: reads public/data/organizations.json from disk, so the
// 1.8 MB registry stays out of the client bundle. Pages pass on just the
// names they need. Read once, as every page's metadata asks for it.
function loadRegistry(): OrganizationRegistryEntry[] {
  registry ??= readDataFile<OrganizationRegistryEntry[]>("organizations");
  return registry;
}

// Every ministry in the registry, one entry each, by id.
export function getMinistries(): { id: number; name: string }[] {
  const ministries = new Map<number, string>();
  for (const entry of loadRegistry()) {
    ministries.set(entry.ministry_id, entry.ministry_name);
  }
  return [...ministries].map(([id, name]) => ({ id, name }));
}

let budgetaries: OrganizationRegistryEntry[] | null = null;

// The registry's budgetary units that are budgeted in at least one year's
// organization file. Units with no data in any year get no page.
export function getBudgetaries(): OrganizationRegistryEntry[] {
  if (budgetaries) return budgetaries;
  const budgeted = new Set<number>();
  for (const fileName of Object.values(DOC_SOURCE_DATA_FILE)) {
    const totals = readDataFile<OrganizationYearTotal[]>(
      fileName.replace(/^budget_/, "organization_"),
    );
    for (const unit of totals) budgeted.add(unit.budgetary_id);
  }
  budgetaries = loadRegistry().filter(({ budgetary_id }) =>
    budgeted.has(budgetary_id),
  );
  return budgetaries;
}
