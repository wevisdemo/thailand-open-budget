import type { BudgetItem } from "@/types/budget";
import type {
  TreemapGrouping,
  TreemapGroupingOption,
  TreemapNode,
} from "@/types/treemap";

export const TREEMAP_GROUPINGS: TreemapGroupingOption[] = [
  {
    value: "plan",
    label: "แผนงาน",
    rootLabel: "แผนงานทั้งหมด",
    maxTiles: 4,
  },
  {
    value: "category",
    label: "ประเภทงบ",
    rootLabel: "ประเภทงบทั้งหมด",
    maxTiles: 5,
  },
  {
    value: "obligation",
    label: "งบผูกพัน",
    rootLabel: "งบทั้งหมด",
    maxTiles: 4,
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

// The groups an item falls in, from the top level down. A plan is named
// under its type without the type, which the level above already shows:
// แผนงานพื้นฐานด้านความมั่นคง is ด้านความมั่นคง under แผนงานพื้นฐาน. A plan
// whose name is only its type, e.g. แผนงานบุคลากรภาครัฐ, has no level under
// its type.
function getItemPath(item: BudgetItem, grouping: TreemapGrouping): string[] {
  if (grouping === "plan") {
    return item.plan_suffix
      ? [item.plan_prefix, item.plan_suffix]
      : [item.plan_prefix];
  }
  if (grouping === "category") {
    const levels = item.category_levels ?? [];
    return levels.length ? levels : ["ไม่ระบุประเภทงบ"];
  }
  // One level: whether the item is committed across fiscal years.
  // 2569's sheet lists a single fiscal year for every item, so in 2570 the
  // งบผูกพันข้ามปี group finds no 2569 figure and shows ไม่พบข้อมูล.
  return item.fiscal_year_list.length > 1
    ? ["งบผูกพันข้ามปี"]
    : ["ไม่ใช่งบผูกพันข้ามปี"];
}

// The group a level's items that go no deeper fall in, beside the level's
// groups: a budget category's items without a sub-category, for one.
const NO_SUBGROUP = "ไม่ระบุหมวดย่อย";

interface MutableNode {
  name: string;
  path: string[];
  amount: number;
  // The amount of the items whose path ends here.
  ownAmount: number;
  children: Map<string, MutableNode>;
}

function freeze(node: MutableNode): TreemapNode {
  const children = [...node.children.values()].map(freeze);
  if (children.length > 0 && node.ownAmount > 0) {
    children.push({
      name: NO_SUBGROUP,
      path: [...node.path, NO_SUBGROUP],
      amount: node.ownAmount,
      children: [],
    });
  }
  return {
    name: node.name,
    path: node.path,
    amount: node.amount,
    children: children.sort((a, b) => b.amount - a.amount),
  };
}

// The items summed into groups, then into the groups' own groups. Items of
// no amount are left out: they would have no area to show. A group with
// both items that stop there and deeper groups shows the stopping items as
// one more group, ไม่ระบุหมวดย่อย, so its groups add up to its amount.
export function buildTreemapTree(
  items: BudgetItem[],
  grouping: TreemapGrouping,
  rootLabel: string,
): TreemapNode {
  const root: MutableNode = {
    name: rootLabel,
    path: [],
    amount: 0,
    ownAmount: 0,
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
          ownAmount: 0,
          children: new Map(),
        };
        node.children.set(name, child);
      }
      child.amount += item.amount;
      node = child;
    }
    node.ownAmount += item.amount;
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
