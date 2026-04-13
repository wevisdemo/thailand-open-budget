export default function SearchIcon({
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
      <circle
        cx="6.5"
        cy="6.5"
        r="5.5"
        stroke={color ?? "#525252"}
        strokeWidth="1.5"
      />
      <path
        d="M10.5 10.5L14.5 14.5"
        stroke={color ?? "#525252"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
