interface SearchDonutChartProps {
  percentage: number;
}

export default function SearchDonutChart({
  percentage,
}: SearchDonutChartProps) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const filledLength = (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="240"
        height="240"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="120"
          cy="120"
          r={radius}
          stroke="#e0e0e0"
          strokeWidth="30"
          fill="none"
        />
        <circle
          cx="120"
          cy="120"
          r={radius}
          stroke="#3904e9"
          strokeWidth="30"
          fill="none"
          strokeDasharray={`${filledLength} ${circumference}`}
          strokeLinecap="butt"
          transform="rotate(-90 120 120)"
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="text-interactive-01 text-[28px] font-bold">
          {percentage.toFixed(2)}%
        </span>
        <span className="text-text-02 mt-[2px] text-[14px]">
          ของงบฯ ทั้งประเทศ
        </span>
      </div>
    </div>
  );
}
