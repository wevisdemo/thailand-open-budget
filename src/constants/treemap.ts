import type { BudgetItem } from "@/types/budget";
import type {
  TreemapGrouping,
  TreemapGroupingOption,
  TreemapNode,
} from "@/types/treemap";
import { getPlanName } from "@/constants/budget";

export const TREEMAP_GROUPINGS: TreemapGroupingOption[] = [
  {
    value: "plan",
    label: "แผนงาน",
    rootLabel: "แผนงานทั้งหมด",
  },
  {
    value: "category",
    label: "ประเภทงบ",
    rootLabel: "ประเภทงบทั้งหมด",
  },
  {
    value: "obligation",
    label: "งบผูกพัน",
    rootLabel: "งบทั้งหมด",
  },
];

// Tile fills, given out in order from the largest tile.
export const TREEMAP_COLORS = [
  "bg-blue-10",
  "bg-cyan-20",
  "bg-green-20",
  "bg-purple-20",
  "bg-magenta-20",
  "bg-teal-20",
  "bg-orange-20",
  "bg-red-20",
];

// The groups an item falls in, from the top level down. A plan whose name is
// only its type, e.g. แผนงานบุคลากรภาครัฐ, has no level under its type.
function getItemPath(item: BudgetItem, grouping: TreemapGrouping): string[] {
  if (grouping === "plan") {
    const plan = getPlanName(item);
    return plan === item.plan_prefix
      ? [item.plan_prefix]
      : [item.plan_prefix, plan];
  }
  if (grouping === "category") {
    return [
      item.category || "ไม่ระบุประเภทงบ",
      item.description || item.output,
    ];
  }
  // TODO: 2569's data lists a single fiscal year for every item, so 2570's
  // obligation groups have no fair 2569 figure to compare with. Decide
  // whether to hide the change for this grouping until the sheet is fixed.
  const years = item.fiscal_year_list.length;
  return years > 1 ? ["งบผูกพันข้ามปี", `ผูกพัน ${years} ปี`] : ["งบปีเดียว"];
}

interface MutableNode {
  name: string;
  path: string[];
  amount: number;
  children: Map<string, MutableNode>;
}

function freeze(node: MutableNode): TreemapNode {
  return {
    name: node.name,
    path: node.path,
    amount: node.amount,
    children: [...node.children.values()]
      .map(freeze)
      .sort((a, b) => b.amount - a.amount),
  };
}

// The items summed into groups, then into the groups' own groups. Items of
// no amount are left out: they would have no area to show.
export function buildTreemapTree(
  items: BudgetItem[],
  grouping: TreemapGrouping,
  rootLabel: string,
): TreemapNode {
  const root: MutableNode = {
    name: rootLabel,
    path: [],
    amount: 0,
    children: new Map(),
  };
  for (const item of items) {
    if (item.amount <= 0) continue;
    root.amount += item.amount;
    let node = root;
    for (const name of getItemPath(item, grouping)) {
      let child = node.children.get(name);
      if (!child) {
        child = {
          name,
          path: [...node.path, name],
          amount: 0,
          children: new Map(),
        };
        node.children.set(name, child);
      }
      child.amount += item.amount;
      node = child;
    }
  }
  return freeze(root);
}

// The node at `path`, or null when that group doesn't exist, e.g. in a year
// whose items have none.
export function getTreemapNode(
  root: TreemapNode,
  path: string[],
): TreemapNode | null {
  let node: TreemapNode | undefined = root;
  for (const name of path) {
    node = node.children.find((child) => child.name === name);
    if (!node) return null;
  }
  return node;
}

export function getTreemapPathKey(path: string[]): string {
  return path.join("\u001f");
}

// Every group's amount by its path, to look up a group's previous-year total.
export function getTreemapAmounts(root: TreemapNode): Map<string, number> {
  const amounts = new Map<string, number>();
  function visit(node: TreemapNode) {
    amounts.set(getTreemapPathKey(node.path), node.amount);
    node.children.forEach(visit);
  }
  visit(root);
  return amounts;
}

// A group's share of the level shown, e.g. "44.6 %".
export function formatTreemapPercent(amount: number, total: number): string {
  return `${total > 0 ? ((amount / total) * 100).toFixed(1) : "0.0"} %`;
}
