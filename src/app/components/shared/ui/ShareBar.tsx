interface ShareBarProps {
  percent: number;
  // Bar length, 0-100. Scaled to the table's largest row rather than the
  // whole budget, since no row comes near 100%.
  fill: number;
}

export default function ShareBar({ percent, fill }: ShareBarProps) {
  return (
    <div className="flex items-center justify-center gap-[12px]">
      <div className="h-[4px] w-[80px]">
        <div
          className="bg-interactive-01 h-[4px]"
          style={{ width: `${Math.min(fill, 100)}%` }}
        />
      </div>
      <span className="w-[48px]">{percent.toFixed(1)}%</span>
    </div>
  );
}
