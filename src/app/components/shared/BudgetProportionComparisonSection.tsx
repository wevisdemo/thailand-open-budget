"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Button,
  ContentSwitcher,
  Dropdown,
  IconSwitch,
  SkeletonPlaceholder,
} from "@carbon/react";
import {
  ChartTreemap,
  Download,
  Table as TableIcon,
} from "@carbon/icons-react";
import type { BudgetItem } from "@/types/budget";
import type { TreemapGroupingOption, TreemapNode } from "@/types/treemap";
import {
  TREEMAP_GROUPINGS,
  buildTreemapTree,
  getTreemapAmounts,
  getTreemapNode,
  getTreemapPathKey,
} from "@/constants/treemap";
import { getChangePercent } from "@/constants/organization";
import { downloadCsv } from "@/lib/csv";
import TreemapBreadcrumb from "./TreemapBreadcrumb";
import TreemapChart from "./TreemapChart";
import TreemapTable from "./TreemapTable";

type TreemapView = "treemap" | "table";

const VIEWS: { value: TreemapView; label: string }[] = [
  { value: "treemap", label: "แผนภาพ" },
  { value: "table", label: "ตาราง" },
];

interface BudgetProportionComparisonSectionProps {
  items: BudgetItem[];
  // The previous year's items, for each group's change; null when the data
  // has no previous year.
  previousItems: BudgetItem[] | null;
  // The country's budget, which the table's % column is a share of.
  countryBudget: number;
  year: number;
  // The CSV's file name before the grouping and year, e.g. "ministry_22".
  csvName: string;
  isLoading: boolean;
  isError: boolean;
}

// "เปรียบเทียบสัดส่วนงบตาม": a set of budget items as a treemap of their
// groups, by plan, budget category or obligation. Clicking a group shows the
// groups inside it; a table view lists the groups, each opening to its own.
export default function BudgetProportionComparisonSection({
  items,
  previousItems,
  countryBudget,
  year,
  csvName,
  isLoading,
  isError,
}: BudgetProportionComparisonSectionProps) {
  const [grouping, setGrouping] = useState<TreemapGroupingOption>(
    TREEMAP_GROUPINGS[0],
  );
  const [path, setPath] = useState<string[]>([]);
  const [view, setView] = useState<TreemapView>("treemap");
  const [width, setWidth] = useState(0);
  const height = width < 640 ? 400 : 580;

  // The treemap is laid out in pixels, so it follows the section's width.
  const measureRef = useCallback((element: HTMLDivElement | null) => {
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const tree = useMemo(
    () => buildTreemapTree(items, grouping.value, grouping.rootLabel),
    [items, grouping],
  );
  const previousAmounts = useMemo(
    () =>
      previousItems
        ? getTreemapAmounts(
            buildTreemapTree(previousItems, grouping.value, grouping.rootLabel),
          )
        : null,
    [previousItems, grouping],
  );
  // A group the newly selected year doesn't have falls back to the top.
  const node = getTreemapNode(tree, path) ?? tree;

  function getPreviousAmount(child: TreemapNode): number | null {
    return previousAmounts?.get(getTreemapPathKey(child.path)) ?? null;
  }

  function handleGroupingChange(option: TreemapGroupingOption) {
    setGrouping(option);
    setPath([]);
  }

  function handleDrill(child: TreemapNode) {
    if (child.children.length === 0) return;
    setPath(child.path);
  }

  // The table's rows: each group, then its sub-groups.
  function handleDownload() {
    function toRow(group: TreemapNode, subGroup: TreemapNode | null) {
      const row = subGroup ?? group;
      const change = getChangePercent(row.amount, getPreviousAmount(row));
      return [
        group.name,
        subGroup?.name ?? "",
        row.amount.toLocaleString("en-US"),
        `${countryBudget > 0 ? ((row.amount / countryBudget) * 100).toFixed(2) : "0.00"}%`,
        change === null ? "" : `${change.toFixed(2)}%`,
      ];
    }
    const rows = tree.children.flatMap((group) => [
      toRow(group, null),
      ...group.children.map((subGroup) => toRow(group, subGroup)),
    ]);
    downloadCsv(
      [
        "group",
        "subgroup",
        "amount",
        "percentage_of_country(%)",
        "change_from_previous_year(%)",
      ],
      rows,
      `${csvName}_${grouping.value}_${year}.csv`,
    );
  }

  const isEmpty = !isLoading && !isError && node.children.length === 0;

  return (
    <div ref={measureRef} className="flex flex-col gap-[16px]">
      <div className="flex flex-col gap-[16px] md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-[8px]">
          <h2 className="font-serif text-[28px] font-bold">
            เปรียบเทียบสัดส่วนงบตาม
          </h2>
          <Dropdown<TreemapGroupingOption>
            id="treemap-grouping"
            titleText="เปรียบเทียบสัดส่วนงบตาม"
            hideLabel
            label={grouping.label}
            items={TREEMAP_GROUPINGS}
            itemToString={(option) => option?.label ?? ""}
            selectedItem={grouping}
            onChange={({ selectedItem }) => {
              if (selectedItem) handleGroupingChange(selectedItem);
            }}
            className="w-[160px] [&_.cds--list-box]:bg-white [&_.cds--list-box\_\_label]:text-[16px] [&_.cds--list-box\_\_label]:font-bold"
          />
          {/* TODO: the design's "แผนงานคืออะไร?" link goes here, once what
              it shows or links to is decided. */}
        </div>
        <Button
          kind="ghost"
          size="sm"
          renderIcon={Download}
          onClick={handleDownload}
          disabled={isLoading || isError || isEmpty}
          className="text-gray-70 border-gray-20 shrink-0 self-start bg-white text-[12px] font-medium md:self-auto"
        >
          ดาวน์โหลดตารางนี้
        </Button>
      </div>
      {/* The table shows every level at once, so it has no breadcrumb. */}
      <div className="flex flex-wrap items-center justify-between gap-[8px]">
        {view === "treemap" && (
          <TreemapBreadcrumb
            tree={tree}
            node={node}
            onSelect={(step) => setPath(step.path)}
          />
        )}
        <ContentSwitcher
          selectedIndex={VIEWS.findIndex((v) => v.value === view)}
          onChange={({ index }) => setView(VIEWS[index ?? 0].value)}
          className="ml-auto w-fit"
        >
          <IconSwitch name="treemap" text={VIEWS[0].label}>
            <ChartTreemap />
          </IconSwitch>
          <IconSwitch name="table" text={VIEWS[1].label}>
            <TableIcon />
          </IconSwitch>
        </ContentSwitcher>
      </div>
      {isLoading ? (
        <SkeletonPlaceholder className="w-full" style={{ height }} />
      ) : isError ? (
        <p className="text-support-01 bg-white px-[16px] py-[24px]">
          โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
        </p>
      ) : isEmpty ? (
        <p className="text-text-02 bg-white px-[16px] py-[24px]">
          ไม่มีรายการงบประมาณในปีนี้
        </p>
      ) : view === "treemap" ? (
        // Keyed by level so a tooltip doesn't outlive the tile under it.
        <TreemapChart
          key={getTreemapPathKey(node.path)}
          node={node}
          width={width}
          height={height}
          getPreviousAmount={getPreviousAmount}
          onDrill={handleDrill}
        />
      ) : (
        <TreemapTable
          tree={tree}
          countryBudget={countryBudget}
          getPreviousAmount={getPreviousAmount}
        />
      )}
    </div>
  );
}
