"use client";

import { Fragment, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableExpandHeader,
  TableExpandRow,
  TableHead,
  TableHeader,
  TableRow,
} from "@carbon/react";
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

interface TreemapTableProps {
  // The top level: its groups are the rows, their own groups the sub-rows.
  tree: TreemapNode;
  // The country's budget, which the % column is a share of.
  // TODO: confirm the design means the country's budget, as its header
  // says, rather than the organization's own.
  countryBudget: number;
  getPreviousAmount: (group: TreemapNode) => number | null;
}

// A sub-group's name without its group's, which the row above already
// shows: "แผนงานยุทธศาสตร์พัฒนา…" under แผนงานยุทธศาสตร์ reads "พัฒนา…".
function getSubGroupName(group: TreemapNode, parent: TreemapNode): string {
  return group.name.startsWith(parent.name) && group.name !== parent.name
    ? group.name.slice(parent.name.length)
    : group.name;
}

// The groups as a table, each opening to its sub-groups. Unsorted, groups
// keep the treemap's order, largest first.
export default function TreemapTable({
  tree,
  countryBudget,
  getPreviousAmount,
}: TreemapTableProps) {
  const [sort, setSort] = useState<OrganizationSort | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Bars are scaled to the largest group, as no group nears 100%.
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

  function renderCells(group: TreemapNode) {
    return (
      <>
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
        <TableCell className="text-right">
          <ChangeBadge
            amount={group.amount}
            previousAmount={getPreviousAmount(group)}
          />
        </TableCell>
      </>
    );
  }

  return (
    <div className="overflow-x-auto">
      {/* The design shows the ↑↓ icon on unsorted columns too, as in the
          units table, and white group rows over grey sub-group rows, each
          cell aligned to the row's first line. */}
      <Table className="[&_td]:text-text-01 [&_.cds--table-sort\_\_icon-unsorted]:opacity-100 [&_td]:bg-white [&_td]:py-[14px] [&_td]:align-top [&_td.cds--table-expand]:py-[10px]">
        <TableHead>
          <TableRow>
            <TableExpandHeader aria-label="ดูหมวดย่อย" />
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
          {sortGroups(tree.children).map((group) => {
            const key = getTreemapPathKey(group.path);
            const name = (
              <TableCell>
                <p>{group.name}</p>
                {group.children.length > 0 && (
                  <p className="text-text-03 text-[14px]">
                    มี {group.children.length.toLocaleString()} หมวดย่อย
                  </p>
                )}
              </TableCell>
            );
            if (group.children.length === 0) {
              return (
                <TableRow key={key}>
                  <TableCell />
                  {name}
                  {renderCells(group)}
                </TableRow>
              );
            }
            const isExpanded = expanded.has(key);
            return (
              <Fragment key={key}>
                <TableExpandRow
                  aria-label={isExpanded ? "ซ่อนหมวดย่อย" : "ดูหมวดย่อย"}
                  isExpanded={isExpanded}
                  onExpand={() => toggle(key)}
                >
                  {name}
                  {renderCells(group)}
                </TableExpandRow>
                {isExpanded &&
                  sortGroups(group.children).map((child) => (
                    <TableRow
                      key={getTreemapPathKey(child.path)}
                      className="[&>td]:bg-ui-01! [&>td]:border-transparent!"
                    >
                      <TableCell />
                      <TableCell>{getSubGroupName(child, group)}</TableCell>
                      {renderCells(child)}
                    </TableRow>
                  ))}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
