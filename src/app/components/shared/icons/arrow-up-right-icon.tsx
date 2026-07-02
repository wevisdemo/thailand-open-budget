export default function ArrowUpRightIcon({
  color = "#161616",
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4.0625 2.4375V3.25H9.17719L2.4375 9.98969L3.01031 10.5625L9.75 3.82281V8.9375H10.5625V2.4375H4.0625Z"
        fill={color}
      />
    </svg>
  );
}
