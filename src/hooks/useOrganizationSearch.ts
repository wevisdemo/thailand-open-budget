"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import type { BudgetItem } from "@/types/budget";
import type {
  Organization,
  OrganizationLevel,
  OrganizationSuggestion,
  OrganizationSuggestionGroup,
} from "@/types/organization";

// Thai text has no word delimiters, so a match may start anywhere inside a
// name — `ignoreLocation` keeps Fuse from penalising late matches. The parent
// ministry is searchable too, but weighted low: typing a ministry name should
// surface its units without outranking a direct hit on the unit's own name.
const FUSE_OPTIONS = {
  keys: [
    { name: "name", weight: 0.8 },
    { name: "ministry", weight: 0.2 },
  ],
  ignoreLocation: true,
  includeMatches: true,
  threshold: 0.4,
  minMatchCharLength: 2,
};

const GROUP_LABELS: Record<OrganizationLevel, string> = {
  ministry: "กระทรวง/หน่วยงานเทียบเท่ากระทรวง",
  budgetary: "กรม/หน่วยงานเทียบเท่ากรม",
};

const GROUP_ORDER: OrganizationLevel[] = ["ministry", "budgetary"];

export const MIN_QUERY_LENGTH = 2;
export const MAX_SUGGESTIONS = 8;

// A budget line names its unit in `budgetary` and that unit's parent in
// `ministry`. A unit with a parent is a department (กรม); a unit without one —
// as are the ministries themselves — sits at ministry level.
function buildOrganizations(data: BudgetItem[]): Organization[] {
  const byId = new Map<string, Organization>();

  // A name identifies a unit on its own — no `budgetary` value sits under two
  // ministries — but a handful (e.g. สภากาชาดไทย) exist at both levels, so the
  // level stays part of the id. `href` is the unit's /organizations page, built
  // from the registry ids the budget rows carry; the id itself is only a key.
  function add(
    name: string,
    level: OrganizationLevel,
    ministry: string,
    href: string,
  ) {
    const id = `${level}:${name}`;
    if (!byId.has(id)) byId.set(id, { id, name, level, ministry, href });
  }

  for (const item of data) {
    const { ministry_id, budgetary_id } = item;
    if (item.ministry && ministry_id !== null) {
      add(item.ministry, "ministry", "", `/organizations/${ministry_id}`);
    }
    if (item.budgetary && ministry_id !== null && budgetary_id !== null) {
      const href = `/organizations/${ministry_id}/${budgetary_id}`;
      if (item.ministry) add(item.budgetary, "budgetary", item.ministry, href);
      else add(item.budgetary, "ministry", "", href);
    }
  }

  return [...byId.values()];
}

export function useOrganizationSearch(
  data: BudgetItem[],
  query: string,
): OrganizationSuggestionGroup[] {
  const fuse = useMemo(
    () => new Fuse(buildOrganizations(data), FUSE_OPTIONS),
    [data],
  );

  return useMemo(() => {
    const q = query.trim();
    if (q.length < MIN_QUERY_LENGTH) return [];

    const suggestions: OrganizationSuggestion[] = fuse
      .search(q, { limit: MAX_SUGGESTIONS })
      .map((result) => {
        const nameMatch = result.matches?.find((m) => m.key === "name");
        const matchIndices = [...(nameMatch?.indices ?? [])].sort(
          (a, b) => a[0] - b[0],
        ) as [number, number][];
        return { organization: result.item, matchIndices };
      });

    return GROUP_ORDER.map((level) => ({
      level,
      label: GROUP_LABELS[level],
      suggestions: suggestions.filter((s) => s.organization.level === level),
    })).filter((group) => group.suggestions.length > 0);
  }, [fuse, query]);
}
