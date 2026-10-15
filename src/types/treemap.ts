// What the budget comparison treemap groups items by.
export type TreemapGrouping = "plan" | "category" | "obligation";

// One group of items: a tile on the treemap, or the level being shown.
export interface TreemapNode {
  name: string;
  // The group names from the top level down to this one; empty for the root.
  path: string[];
  amount: number;
  // Largest first. Empty for a group that can't be drilled into.
  children: TreemapNode[];
}

export interface TreemapGroupingOption {
  value: TreemapGrouping;
  label: string;
  // The breadcrumb's first step, e.g. "แผนงานทั้งหมด".
  rootLabel: string;
  // The most groups a treemap level shows, largest first. The table lists
  // them all.
  maxTiles: number;
}
