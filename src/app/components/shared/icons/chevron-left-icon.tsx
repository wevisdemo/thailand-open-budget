export default function ChevronLeftIcon({
  color,
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        width="16"
        height="16"
        fill="white"
        style={{ mixBlendMode: "multiply" }}
      />
      <path d="M10 12L5 8L10 4V12Z" fill={color ?? "#161616"} />
    </svg>
  );
}
