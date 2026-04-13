interface TrendDataPoint {
  year: number;
  value: number;
  isCurrent: boolean;
}

interface SearchLineChartProps {
  data: TrendDataPoint[];
}

function formatValue(v: number): string {
  if (v === 0) return "0";
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return `${v}`;
}

function getNiceTicks(max: number, count: number): number[] {
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
  const niceMax = Math.ceil(max / magnitude) * magnitude;
  const step = niceMax / (count - 1);
  return Array.from({ length: count }, (_, i) => step * i);
}

export default function SearchLineChart({ data }: SearchLineChartProps) {
  const W = 600;
  const H = 300;
  const pl = 64;
  const pr = 40;
  const pt = 20;
  const pb = 40;

  const chartW = W - pl - pr;
  const chartH = H - pt - pb;

  const maxValue = Math.max(...data.map((d) => d.value));
  const yTicks = getNiceTicks(maxValue, 4);
  const niceMax = yTicks[yTicks.length - 1];

  const getX = (i: number) => pl + (i / (data.length - 1)) * chartW;
  const getY = (v: number) => pt + (1 - v / niceMax) * chartH;

  const polylinePoints = data
    .map((d, i) => `${getX(i)},${getY(d.value)}`)
    .join(" ");

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Y-axis grid lines and labels */}
      {yTicks.map((tick) => (
        <g key={tick}>
          <text
            x={pl - 10}
            y={getY(tick)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize="16"
            fill="#8d8d8d"
          >
            {formatValue(tick)}
          </text>
          <line
            x1={pl}
            y1={getY(tick)}
            x2={pl + chartW}
            y2={getY(tick)}
            stroke={tick === 0 ? "#e0e0e0" : "#a8a8a8"}
            strokeWidth="1"
            strokeDasharray={tick === 0 ? undefined : "4 4"}
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

      {/* Data points */}
      {data.map((d, i) => (
        <circle
          key={d.year}
          cx={getX(i)}
          cy={getY(d.value)}
          r={d.isCurrent ? 8 : 6}
          fill={d.isCurrent ? "#3904e9" : "white"}
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
  );
}
