"use client";

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { hierarchy, treemap } from "d3-hierarchy";
import { Popover, PopoverContent } from "@carbon/react";
import type { TreemapNode } from "@/types/treemap";
import { TREEMAP_COLORS, formatTreemapPercent } from "@/constants/treemap";
import ChangeBadge from "../ui/ChangeBadge";

// A tile needs this much room for its name, and this much height for its
// percentage under the name.
const LABEL_MIN_WIDTH = 64;
const LABEL_MIN_HEIGHT = 24;
const PERCENT_MIN_HEIGHT = 48;
// The smallest share of the level a tile is drawn at, however small its group.
const MIN_TILE_SHARE = 0.01;

export interface TileBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Tile extends TileBox {
  node: TreemapNode;
  color: string;
}

// A tile's tooltip: the tile, the amount of the level it sits in, and where
// it points, in pixels from the treemap's top left.
export interface Hover {
  node: TreemapNode;
  levelAmount: number;
  x: number;
  y: number;
}

// How long the tooltip of a touched tile stays on the level it opened, since
// a finger leaves no hover behind.
const ARRIVAL_TOOLTIP_MS = 1500;

interface TreemapChartProps {
  // Fill for every tile, when the level's groups all share one: the color of
  // the top-level group they sit in. Without it, tiles get one each by rank.
  color?: string;
  // The level shown: its groups are the tiles.
  node: TreemapNode;
  width: number;
  height: number;
  getPreviousAmount: (child: TreemapNode) => number | null;
  // The clicked tile's box, in pixels from the treemap's top left, and its
  // tooltip when a finger or pen clicked it (null for a mouse or keyboard).
  onDrill: (child: TreemapNode, from: TileBox, tooltip: Hover | null) => void;
  // The tile this level was opened from: the first tile grows out of it.
  from?: TileBox | null;
  arrivalTooltip?: Hover | null;
  // Called once the chart has taken `from`, so the owner can clear it and a
  // later remount doesn't grow from a stale tile.
  onSettled?: () => void;
}

// How a tile moves in. The first tile of a level opened by a click grows out
// of the clicked tile; the rest fade and scale in, one after another.
function getTileMotion(grows: boolean, entered: boolean) {
  if (grows) {
    return "motion-safe:transition-[left,top,width,height] motion-safe:duration-500 motion-safe:ease-out";
  }
  const state = entered ? "scale-100 opacity-100" : "scale-95 opacity-0";
  return `motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-out ${state}`;
}

function isTouch(event: MouseEvent<HTMLElement>) {
  const { pointerType } = event.nativeEvent as PointerEvent;
  return pointerType === "touch" || pointerType === "pen";
}

function getTooltipAt(
  event: MouseEvent<HTMLElement>,
  node: TreemapNode,
  levelAmount: number,
): Hover {
  const chart = event.currentTarget.parentElement!.getBoundingClientRect();
  return {
    node,
    levelAmount,
    x: event.clientX - chart.left,
    y: event.clientY - chart.top,
  };
}

// Carbon's tooltip sits centred over the pointer, turning to the side near
// an edge so it stays inside the treemap, and below near the top.
function getTooltipAlign(hover: Hover, width: number) {
  const vertical = hover.y < 140 ? "bottom" : "top";
  if (hover.x < 120) return `${vertical}-start` as const;
  if (hover.x > width - 120) return `${vertical}-end` as const;
  return vertical;
}

interface TreemapTooltipProps {
  hover: Hover;
  width: number;
  previousAmount: number | null;
}

function TreemapTooltip({ hover, width, previousAmount }: TreemapTooltipProps) {
  const { node, levelAmount, x, y } = hover;
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y }}>
      <Popover open highContrast align={getTooltipAlign(hover, width)}>
        <span className="block h-0 w-0" />
        <PopoverContent className="pointer-events-none">
          <div className="flex w-max max-w-[280px] flex-col gap-[2px] px-[16px] py-[12px] text-[14px] leading-[20px]">
            <span className="font-bold">{node.name}</span>
            <span>{node.amount.toLocaleString("en-US")}</span>
            <span>
              {formatTreemapPercent(node.amount, levelAmount)} ของระดับนี้
            </span>
            <span className="mt-[4px]">
              <ChangeBadge
                amount={node.amount}
                previousAmount={previousAmount}
              />
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// One level of groups as tiles sized by amount, each with its name and share
// of the level. A tile with groups inside it is a button that shows them.
export default function TreemapChart({
  color,
  node,
  width,
  height,
  getPreviousAmount,
  onDrill,
  from,
  arrivalTooltip,
  onSettled,
}: TreemapChartProps) {
  const [hover, setHover] = useState<Hover | null>(null);
  // Keeps the origin it mounted with, whatever `from` becomes after.
  const [origin] = useState(from);
  const [arrival, setArrival] = useState(arrivalTooltip ?? null);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    onSettled?.();
    // Two frames, so the starting position is painted before it changes.
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!arrival) return;
    const timer = setTimeout(() => setArrival(null), ARRIVAL_TOOLTIP_MS);
    return () => clearTimeout(timer);
  }, [arrival]);

  const tiles = useMemo<Tile[]>(() => {
    if (width === 0) return [];
    // A group below the minimum share is drawn at it, so it stays a visible,
    // hoverable tile. Labels and tooltips still show its real amount.
    const minAmount =
      node.children.reduce((sum, child) => sum + child.amount, 0) *
      MIN_TILE_SHARE;
    // Only the shown level's groups are tiles; their own groups wait for a
    // click.
    const root = hierarchy<TreemapNode>(node, (d) =>
      d === node ? d.children : undefined,
    ).sum((d) => (d === node ? 0 : Math.max(d.amount, minAmount)));
    return (
      treemap<TreemapNode>().size([width, height]).paddingInner(4)(root)
        .children ?? []
    ).map((leaf, i) => ({
      node: leaf.data,
      x: leaf.x0,
      y: leaf.y0,
      width: leaf.x1 - leaf.x0,
      height: leaf.y1 - leaf.y0,
      color: color ?? TREEMAP_COLORS[i % TREEMAP_COLORS.length],
    }));
  }, [color, node, width, height]);

  const tooltip = hover ?? arrival;

  return (
    <div
      className="relative w-full"
      style={{ height }}
      onMouseLeave={() => setHover(null)}
    >
      {tiles.map((tile, i) => {
        const showLabel =
          tile.width >= LABEL_MIN_WIDTH && tile.height >= LABEL_MIN_HEIGHT;
        const drillable = tile.node.children.length > 0;
        const grows = i === 0 && !!origin;
        // Until entered, the growing tile sits where it was clicked.
        const { x, y, width: w, height: h } = grows && !entered ? origin : tile;
        const percent = formatTreemapPercent(tile.node.amount, node.amount);
        const Tag = drillable ? "button" : "div";
        return (
          <Tag
            key={tile.node.name}
            type={drillable ? "button" : undefined}
            aria-label={`${tile.node.name} ${percent}`}
            onClick={
              drillable
                ? (event) =>
                    onDrill(
                      tile.node,
                      tile,
                      isTouch(event)
                        ? getTooltipAt(event, tile.node, node.amount)
                        : null,
                    )
                : undefined
            }
            onMouseMove={(event) =>
              setHover(getTooltipAt(event, tile.node, node.amount))
            }
            onFocus={() =>
              setHover({
                node: tile.node,
                levelAmount: node.amount,
                x: tile.x + tile.width / 2,
                y: tile.y + tile.height / 2,
              })
            }
            onBlur={() => setHover(null)}
            className={`absolute flex flex-col items-center justify-center overflow-hidden rounded-[2px] text-center ${getTileMotion(grows, entered)} ${showLabel ? "px-[8px]" : ""} ${tile.color} ${drillable ? "cursor-pointer" : ""}`}
            style={{
              left: x,
              top: y,
              width: w,
              height: h,
              transitionDelay: grows ? undefined : `${Math.min(i, 8) * 30}ms`,
            }}
          >
            {showLabel && (
              <>
                <span
                  className={`text-text-01 text-[14px] leading-[28px] font-bold break-words md:text-[16px] md:leading-[32px] ${tile.height >= 80 ? "line-clamp-2" : "line-clamp-1"}`}
                >
                  {tile.node.name}
                </span>
                {tile.height >= PERCENT_MIN_HEIGHT && (
                  <span className="text-text-01 text-[14px]">{percent}</span>
                )}
              </>
            )}
          </Tag>
        );
      })}
      {tooltip && (
        <TreemapTooltip
          hover={tooltip}
          width={width}
          previousAmount={getPreviousAmount(tooltip.node)}
        />
      )}
    </div>
  );
}
