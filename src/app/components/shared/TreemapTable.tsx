"use client";

import { useState, type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
import { ChevronDown, ChevronRight } from "@carbon/icons-react";
import type { TreemapNode } from "@/types/treemap";
import type {
  OrganizationSort,
  OrganizationSortKey,
} from "@/types/organization";
import { getTreemapPathKey } from "@/constants/treemap";
import {
  compareByOrganizationSort,
  getNextOrganizationSort,
  getOrganizationSortDirection,
} from "@/constants/organization";
import ShareBar from "./ShareBar";
import ChangeBadge from "./ChangeBadge";

// Each level down sits this much further right.
const INDENT = 48;

// Each level down sits on a darker grey, from the third level on the same;
// only the top level's rows are divided by lines.
const ROW_STYLES = [
  "[&>td]:bg-white!",
  "[&>td]:bg-gray-10! [&>td]:border-transparent!",
  "[&>td]:bg-gray-20! [&>td]:border-transparent!",
];

interface TreemapTableProps {
  // The top level: its groups are the rows, each opening to its own groups,
  // down to the deepest level.
  tree: TreemapNode;
  // The country's budget, which the % column is a share of, as its header
  // says: "% ของงบฯ ประเทศ".
  countryBudget: number;
  getPreviousAmount: (group: TreemapNode) => number | null;
}

// The groups as a tree table, from the top level whichever level the
// treemap shows: a group's chevron opens its groups in rows under it, one
// step further right, and so on down. Unsorted, groups keep the treemap's
// order, largest first; a sort orders every level.
export default function TreemapTable({
  tree,
  countryBudget,
  getPreviousAmount,
}: TreemapTableProps) {
  const [sort, setSort] = useState<OrganizationSort | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Bars are scaled to the level's largest group, as no group nears 100%.
  const maxAmount = Math.max(...tree.children.map((g) => g.amount), 1);

  function sortGroups(groups: TreemapNode[]): TreemapNode[] {
    if (!sort) return groups;
    return [...groups].sort(
      compareByOrganizationSort<TreemapNode>(sort, (group) => [
        group.amount,
        getPreviousAmount(group),
      ]),
    );
  }

  function toggle(key: string) {
    const next = new Set(expanded);
    if (!next.delete(key)) next.add(key);
    setExpanded(next);
  }

  function sortHeaderProps(key: OrganizationSortKey) {
    return {
      isSortable: true,
      isSortHeader: sort?.key === key,
      sortDirection: getOrganizationSortDirection(key, sort),
      onClick: () => setSort(getNextOrganizationSort(key, sort)),
    };
  }

  // A group's row, then, while it is open, its groups' rows.
  function renderRows(group: TreemapNode, depth: number): ReactNode[] {
    const key = getTreemapPathKey(group.path);
    const hasChildren = group.children.length > 0;
    const isExpanded = expanded.has(key);
    const Chevron = isExpanded ? ChevronDown : ChevronRight;
    const row = (
      <TableRow
        key={key}
        className={ROW_STYLES[Math.min(depth, ROW_STYLES.length - 1)]}
      >
        <TableCell style={{ paddingLeft: 16 + depth * INDENT }}>
          <div className="flex items-start gap-[32px]">
            {hasChildren ? (
              <button
                type="button"
                aria-expanded={isExpanded}
                aria-label={isExpanded ? "ซ่อนหมวดย่อย" : "ดูหมวดย่อย"}
                onClick={() => toggle(key)}
                className="flex h-[22px] w-[16px] shrink-0 cursor-pointer items-center justify-center"
              >
                <Chevron />
              </button>
            ) : (
              <span className="w-[16px] shrink-0" />
            )}
            <p>{group.name}</p>
          </div>
        </TableCell>
        <TableCell className="text-right whitespace-nowrap">
          {group.amount.toLocaleString("en-US")}
        </TableCell>
        <TableCell>
          <ShareBar
            percent={
              countryBudget > 0 ? (group.amount / countryBudget) * 100 : 0
            }
            fill={(group.amount / maxAmount) * 100}
          />
        </TableCell>
        {/* The badge is taller than a line of text: less padding keeps the
            row at the text's height. */}
        <TableCell className="py-[10px]! text-right">
          <ChangeBadge
            amount={group.amount}
            previousAmount={getPreviousAmount(group)}
            onLayer={depth > 0}
          />
        </TableCell>
      </TableRow>
    );
    if (!isExpanded) return [row];
    return [
      row,
      ...sortGroups(group.children).flatMap((child) =>
        renderRows(child, depth + 1),
      ),
    ];
  }

  return (
    <div className="overflow-x-auto">
      {/* The design shows the ↑↓ icon on unsorted columns too, as in the
          units table, with each cell aligned to its row's first line. */}
      <Table className="[&_td]:text-text-01 [&_.cds--table-sort\_\_icon-unsorted]:opacity-100 [&_td]:py-[12px] [&_td]:align-top [&_td]:leading-[22px]">
        <TableHead>
          <TableRow>
            <TableHeader>ประเภท</TableHeader>
            <TableHeader className="w-[180px]" {...sortHeaderProps("amount")}>
              จำนวนเงิน
            </TableHeader>
            <TableHeader className="w-[180px]">% ของงบฯ ประเทศ</TableHeader>
            <TableHeader className="w-[200px]" {...sortHeaderProps("change")}>
              การเปลี่ยนแปลง (%) จากปีก่อน
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortGroups(tree.children).flatMap((group) => renderRows(group, 0))}
        </TableBody>
      </Table>
    </div>
  );
}
