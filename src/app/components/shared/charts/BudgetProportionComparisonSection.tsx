"use client";

import { useCallback, useMemo, useState } from "react";
import { ContentSwitcher, Dropdown, IconSwitch } from "@carbon/react";
import { ChartTreemap, Table as TableIcon } from "@carbon/icons-react";
import type {
  TreemapGrouping,
  TreemapGroupingOption,
  TreemapNode,
} from "@/types/treemap";
import {
  TREEMAP_GROUPINGS,
  getTreemapAmounts,
  getTreemapColor,
  getTreemapDepth,
  getTreemapNode,
  getTreemapPathKey,
} from "@/constants/treemap";
import { getChangePercent } from "@/constants/organization";
import { downloadCsv } from "@/lib/csv";
import DownloadButton from "../ui/DownloadButton";
import CategoryInfoModal from "../modals/CategoryInfoModal";
import ObligationInfoModal from "../modals/ObligationInfoModal";
import PlanInfoModal from "../modals/PlanInfoModal";
import TreemapBreadcrumb from "./TreemapBreadcrumb";
import TreemapChart, { type Hover, type TileBox } from "./TreemapChart";
import TreemapTable from "./TreemapTable";

type TreemapView = "treemap" | "table";

// The modal the "…คืออะไร?" link beside the dropdown opens, per grouping.
const INFO_MODALS = {
  plan: PlanInfoModal,
  category: CategoryInfoModal,
  obligation: ObligationInfoModal,
};

const VIEWS: { value: TreemapView; label: string }[] = [
  { value: "treemap", label: "แผนภาพ" },
  { value: "table", label: "ตาราง" },
];

interface BudgetProportionComparisonSectionProps {
  // The year's groups, by grouping, built at build time from its items.
  trees: Record<TreemapGrouping, TreemapNode>;
  // The previous year's, for each group's change; null when the data has no
  // previous year.
  previousTrees: Record<TreemapGrouping, TreemapNode> | null;
  // The country's budget, which the table's % column is a share of.
  countryBudget: number;
  year: number;
  // The CSV's file name before the grouping and year, e.g. "ministry_22".
  csvName: string;
}

// "เปรียบเทียบสัดส่วนงบตาม": a set of budget items' groups as a treemap, by plan, budget category or obligation. Clicking a group shows the
// groups inside it; a table view lists the top level's groups, each opening
// to its own, down to the deepest level.
export default function BudgetProportionComparisonSection({
  trees,
  previousTrees,
  countryBudget,
  year,
  csvName,
}: BudgetProportionComparisonSectionProps) {
  const [grouping, setGrouping] = useState<TreemapGroupingOption>(
    TREEMAP_GROUPINGS[0],
  );
  const [path, setPath] = useState<string[]>([]);
  // The tile last clicked, which the next level's first tile grows out of.
  const [from, setFrom] = useState<TileBox | null>(null);
  const [arrivalTooltip, setArrivalTooltip] = useState<Hover | null>(null);
  const [view, setView] = useState<TreemapView>("treemap");
  const [infoOpen, setInfoOpen] = useState(false);
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

  const tree = trees[grouping.value];
  const previousAmounts = useMemo(
    () =>
      previousTrees ? getTreemapAmounts(previousTrees[grouping.value]) : null,
    [previousTrees, grouping],
  );
  // A group the newly selected year doesn't have falls back to the top.
  const node = getTreemapNode(tree, path) ?? tree;

  function getPreviousAmount(child: TreemapNode): number | null {
    return previousAmounts?.get(getTreemapPathKey(child.path)) ?? null;
  }

  function handleGroupingChange(option: TreemapGroupingOption) {
    setGrouping(option);
    setPath([]);
    setFrom(null);
    setArrivalTooltip(null);
  }

  function handleDrill(
    child: TreemapNode,
    box: TileBox,
    tooltip: Hover | null,
  ) {
    if (child.children.length === 0) return;
    setFrom(box);
    setArrivalTooltip(tooltip);
    setPath(child.path);
  }

  // The table's rows, every level open: each group, then its groups, named
  // by their path from the top.
  function handleDownload() {
    function toRows(group: TreemapNode): string[][] {
      const change = getChangePercent(group.amount, getPreviousAmount(group));
      return [
        [
          String(group.path.length),
          group.path.join(" / "),
          group.amount.toLocaleString("en-US"),
          `${countryBudget > 0 ? ((group.amount / countryBudget) * 100).toFixed(3) : "0.000"}%`,
          change === null ? "" : `${change.toFixed(3)}%`,
        ],
        ...group.children.flatMap(toRows),
      ];
    }
    downloadCsv(
      [
        "level",
        "group",
        "amount",
        "percentage_of_country(%)",
        "change_from_previous_year(%)",
      ],
      tree.children.flatMap(toRows),
      `${csvName}_${grouping.value}_${year}.csv`,
    );
  }

  const InfoModal = INFO_MODALS[grouping.value];
  // A grouping of one level, like งบผูกพัน, has nowhere to go, so it has no
  // breadcrumb.
  const hasLevels = getTreemapDepth(tree) > 1;
  const isEmpty = node.children.length === 0;

  return (
    <div ref={measureRef} className="flex flex-col gap-[8px]">
      <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
      <div className="flex flex-col flex-wrap gap-[16px] md:flex-row md:items-center md:justify-between">
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
            className="w-[160px] font-serif [&_.cds--list-box]:bg-white [&_.cds--list-box\_\_label]:text-[16px] [&_.cds--list-box\_\_label]:font-bold"
          />
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            className="text-link-01 cursor-pointer text-[14px] underline"
          >
            {grouping.label}คืออะไร?
          </button>
        </div>
        <DownloadButton
          text="ดาวน์โหลดตารางนี้"
          onClick={handleDownload}
          disabled={isEmpty}
          className="self-start md:self-auto"
        />
      </div>
      <div className="flex items-center justify-between gap-[8px]">
        {/* The table always shows the top level, so only the treemap has a
            breadcrumb. */}
        {view === "treemap" && hasLevels && (
          <TreemapBreadcrumb
            tree={tree}
            node={node}
            onSelect={(step) => {
              setFrom(null);
              setArrivalTooltip(null);
              setPath(step.path);
            }}
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
      <div className="mt-[8px]">
        {isEmpty ? (
          <p className="text-text-02 bg-white px-[16px] py-[24px]">
            ไม่มีรายการงบประมาณในปีนี้
          </p>
        ) : view === "treemap" ? (
          // Keyed by level so a tooltip doesn't outlive the tile under it.
          <TreemapChart
            key={getTreemapPathKey(node.path)}
            color={getTreemapColor(tree, node) ?? undefined}
            node={node}
            width={width}
            height={height}
            getPreviousAmount={getPreviousAmount}
            from={from}
            arrivalTooltip={arrivalTooltip}
            onSettled={() => {
              setFrom(null);
              setArrivalTooltip(null);
            }}
            onDrill={handleDrill}
          />
        ) : (
          // Keyed by grouping, so another grouping opens with its rows closed.
          <TreemapTable
            key={grouping.value}
            tree={tree}
            countryBudget={countryBudget}
            getPreviousAmount={getPreviousAmount}
          />
        )}
      </div>
    </div>
  );
}
