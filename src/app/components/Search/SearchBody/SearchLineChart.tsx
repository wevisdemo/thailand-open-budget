"use client";

import { useState } from "react";
import { Tooltip } from "@carbon/react";

interface TrendDataPoint {
  year: number;
  value: number;
  isCurrent: boolean;
}

interface SearchLineChartProps {
  data: TrendDataPoint[];
  unit: "million" | "percent";
}

// Decimal places that tell ticks `step` apart once divided by `divisor`.
function getDecimals(step: number, divisor: number, min: number): number {
  return Math.max(min, Math.ceil(-Math.log10(step / divisor)));
}

function formatValue(
  v: number,
  unit: "million" | "percent",
  step: number,
): string {
  if (unit === "percent") return `${v.toFixed(getDecimals(step, 1, 2))}%`;
  if (v === 0) return "0";
  if (v >= 1_000_000) {
    return `${(v / 1_000_000).toFixed(getDecimals(step, 1_000_000, 1))}B`;
  }
  if (v >= 1_000) return `${(v / 1_000).toFixed(getDecimals(step, 1_000, 1))}K`;
  return `${v.toFixed(getDecimals(step, 1, 0))}`;
}

// A point's exact value for its tooltip, e.g. "10,222.53 ล้านบาท" or "0.27%".
function formatPointValue(v: number, unit: "million" | "percent"): string {
  if (unit === "percent") return `${v.toFixed(2)}%`;
  const amount = v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount} ล้านบาท`;
}

// Ticks at a round step (1, 2 or 5 × 10^n) from just below the lowest value
// to just above the highest, so the line uses the chart's full height rather
// than sitting at the top of an axis that starts at zero.
function getNiceTicks(min: number, max: number, count: number): number[] {
  const range = max - min || Math.abs(max) || 1;
  const roughStep = range / (count - 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const step =
    [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= roughStep) ??
    10 * magnitude;
  const start = Math.floor(min / step) * step;
  const end = Math.max(Math.ceil(max / step) * step, start + step);
  const ticks: number[] = [];
  for (let i = 0; start + i * step <= end + step / 2; i++) {
    // Rounded so float drift doesn't print as 0.30000000000000004.
    ticks.push(Number((start + i * step).toPrecision(12)));
  }
  return ticks;
}

export default function SearchLineChart({ data, unit }: SearchLineChartProps) {
  const W = 600;
  const H = 300;
  const pl = 90;
  const pr = 40;
  const pt = 20;
  const pb = 40;

  const chartW = W - pl - pr;
  const chartH = H - pt - pb;

  const values = data.map((d) => d.value);
  const yTicks = getNiceTicks(Math.min(...values), Math.max(...values), 5);
  const yMin = yTicks[0];
  const yMax = yTicks[yTicks.length - 1];
  const yStep = yTicks[1] - yTicks[0];

  const getX = (i: number) =>
    data.length > 1 ? pl + (i / (data.length - 1)) * chartW : pl + chartW / 2;
  const getY = (v: number) => pt + (1 - (v - yMin) / (yMax - yMin)) * chartH;

  const [hovered, setHovered] = useState<number | null>(null);

  const polylinePoints = data
    .map((d, i) => `${getX(i)},${getY(d.value)}`)
    .join(" ");

  return (
    // The SVG keeps its viewBox's aspect ratio at full width, so a point's
    // position as a share of W and H is also its share of this box.
    <div className="relative">
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="block"
      >
        {/* Y-axis grid lines and labels */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <text
              x={pl - 10}
              y={getY(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="16"
              fill="#8d8d8d"
            >
              {formatValue(tick, unit, yStep)}
            </text>
            <line
              x1={pl}
              y1={getY(tick)}
              x2={pl + chartW}
              y2={getY(tick)}
              stroke={i === 0 ? "#e0e0e0" : "#a8a8a8"}
              strokeWidth="1"
              strokeDasharray={i === 0 ? undefined : "4 4"}
            />
          </g>
        ))}

        {/* Line */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke="#3904e9"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Data points; the hovered one grows. */}
        {data.map((d, i) => (
          <circle
            key={d.year}
            cx={getX(i)}
            cy={getY(d.value)}
            r={(d.isCurrent ? 8 : 6) + (hovered === i ? 3 : 0)}
            fill={d.isCurrent || hovered === i ? "#3904e9" : "white"}
            stroke="#3904e9"
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={d.year}
            x={getX(i)}
            y={H - pb + 36}
            textAnchor="middle"
            fontSize="16"
            fill={d.isCurrent ? "#3904e9" : "#6f6f6f"}
            fontWeight={d.isCurrent ? "bold" : "normal"}
          >
            {d.year}
          </text>
        ))}
      </svg>

      {/* An invisible hover and focus target over each point, carrying its
          value in a Carbon tooltip; the tooltip is HTML, so it can't sit
          inside the SVG. */}
      {data.map((d, i) => (
        <div
          key={d.year}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${(getX(i) / W) * 100}%`,
            top: `${(getY(d.value) / H) * 100}%`,
          }}
        >
          <Tooltip
            label={formatPointValue(d.value, unit)}
            align="top"
            enterDelayMs={0}
            leaveDelayMs={0}
          >
            <button
              type="button"
              aria-label={`ปี ${d.year}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="block h-[24px] w-[24px] rounded-full hover:cursor-pointer"
            />
          </Tooltip>
        </div>
      ))}
    </div>
  );
}
