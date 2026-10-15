"use client";

import { useMemo, useState } from "react";
import { hierarchy, treemap } from "d3-hierarchy";
import { Popover, PopoverContent } from "@carbon/react";
import type { TreemapNode } from "@/types/treemap";
import {
  TREEMAP_COLORS,
  TREEMAP_MAX_TILES,
  formatTreemapPercent,
} from "@/constants/treemap";
import ChangeBadge from "./ChangeBadge";

// A tile needs this much room for its name, and this much height for its
// percentage under the name.
const LABEL_MIN_WIDTH = 64;
const LABEL_MIN_HEIGHT = 24;
const PERCENT_MIN_HEIGHT = 48;

interface Tile {
  node: TreemapNode;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

// The hovered or focused tile, and where its tooltip points, in pixels from
// the treemap's top left.
interface Hover {
  node: TreemapNode;
  x: number;
  y: number;
}

interface TreemapChartProps {
  // The level shown: its groups are the tiles.
  node: TreemapNode;
  width: number;
  height: number;
  getPreviousAmount: (child: TreemapNode) => number | null;
  onDrill: (child: TreemapNode) => void;
}

// Carbon's tooltip sits centred over the pointer, turning to the side near
// an edge so it stays inside the treemap, and below near the top.
function getTooltipAlign(hover: Hover, width: number) {
  const vertical = hover.y < 140 ? "bottom" : "top";
  if (hover.x < 120) return `${vertical}-start` as const;
  if (hover.x > width - 120) return `${vertical}-end` as const;
  return vertical;
}

// One level of groups as tiles sized by amount, each with its name and share
// of the level. A tile with groups inside it is a button that shows them.
export default function TreemapChart({
  node,
  width,
  height,
  getPreviousAmount,
  onDrill,
}: TreemapChartProps) {
  const [hover, setHover] = useState<Hover | null>(null);

  const tiles = useMemo<Tile[]>(() => {
    if (width === 0) return [];
    // Only the shown level's largest groups are tiles, filling the treemap
    // between them; their own groups wait for a click. Each tile's
    // percentage stays its share of the whole level.
    const root = hierarchy<TreemapNode>(node, (d) =>
      d === node ? d.children.slice(0, TREEMAP_MAX_TILES) : undefined,
    ).sum((d) => (d === node ? 0 : d.amount));
    return (
      treemap<TreemapNode>().size([width, height]).paddingInner(4)(root)
        .children ?? []
    ).map((leaf, i) => ({
      node: leaf.data,
      x: leaf.x0,
      y: leaf.y0,
      width: leaf.x1 - leaf.x0,
      height: leaf.y1 - leaf.y0,
      color: TREEMAP_COLORS[i % TREEMAP_COLORS.length],
    }));
  }, [node, width, height]);

  return (
    <div
      className="relative w-full"
      style={{ height }}
      onMouseLeave={() => setHover(null)}
    >
      {tiles.map((tile) => {
        const showLabel =
          tile.width >= LABEL_MIN_WIDTH && tile.height >= LABEL_MIN_HEIGHT;
        const drillable = tile.node.children.length > 0;
        const Tag = drillable ? "button" : "div";
        return (
          <Tag
            key={tile.node.name}
            type={drillable ? "button" : undefined}
            aria-label={`${tile.node.name} ${formatTreemapPercent(tile.node.amount, node.amount)}`}
            onClick={drillable ? () => onDrill(tile.node) : undefined}
            onMouseMove={(event) => {
              const box =
                event.currentTarget.parentElement!.getBoundingClientRect();
              setHover({
                node: tile.node,
                x: event.clientX - box.left,
                y: event.clientY - box.top,
              });
            }}
            onFocus={() =>
              setHover({
                node: tile.node,
                x: tile.x + tile.width / 2,
                y: tile.y + tile.height / 2,
              })
            }
            onBlur={() => setHover(null)}
            className={`absolute flex flex-col items-center justify-center overflow-hidden rounded-[2px] px-[8px] text-center ${tile.color} ${drillable ? "cursor-pointer hover:brightness-95" : ""}`}
            style={{
              left: tile.x,
              top: tile.y,
              width: tile.width,
              height: tile.height,
            }}
          >
            {showLabel && (
              <>
                <span
                  className={`text-text-01 text-[14px] leading-[18px] font-bold break-words md:text-[16px] md:leading-[20px] ${tile.height >= 80 ? "line-clamp-2" : "line-clamp-1"}`}
                >
                  {tile.node.name}
                </span>
                {tile.height >= PERCENT_MIN_HEIGHT && (
                  <span className="text-text-01 text-[14px]">
                    {formatTreemapPercent(tile.node.amount, node.amount)}
                  </span>
                )}
              </>
            )}
          </Tag>
        );
      })}
      {hover && (
        <div
          className="pointer-events-none absolute"
          style={{ left: hover.x, top: hover.y }}
        >
          <Popover open highContrast align={getTooltipAlign(hover, width)}>
            <span className="block h-0 w-0" />
            <PopoverContent className="pointer-events-none">
              <div className="flex w-max max-w-[280px] flex-col gap-[2px] px-[16px] py-[12px] text-[14px] leading-[20px]">
                <span className="font-bold">{hover.node.name}</span>
                <span>{hover.node.amount.toLocaleString("en-US")}</span>
                <span>
                  {formatTreemapPercent(hover.node.amount, node.amount)}{" "}
                  ของระดับนี้
                </span>
                <span className="mt-[4px]">
                  <ChangeBadge
                    amount={hover.node.amount}
                    previousAmount={getPreviousAmount(hover.node)}
                  />
                </span>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
}
