import { readFileSync } from "fs";
import { join } from "path";
import type { OrganizationRegistryEntry } from "@/types/organization";

// Build-time only: reads public/data/organizations.json from disk, so the
// 1.8 MB registry stays out of the client bundle. Pages pass on just the
// names they need.
function loadRegistry(): OrganizationRegistryEntry[] {
  const file = join(process.cwd(), "public", "data", "organizations.json");
  return JSON.parse(readFileSync(file, "utf8"));
}

// Every ministry in the registry, one entry each, by id.
export function getMinistries(): { id: number; name: string }[] {
  const ministries = new Map<number, string>();
  for (const entry of loadRegistry()) {
    ministries.set(entry.ministry_id, entry.ministry_name);
  }
  return [...ministries].map(([id, name]) => ({ id, name }));
}
