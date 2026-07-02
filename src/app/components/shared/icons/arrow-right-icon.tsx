export default function ArrowRightIcon({
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
        d="M2.4375 6.5H10.5625M10.5625 6.5L7.5 3.4375M10.5625 6.5L7.5 9.5625"
        stroke={color}
        strokeWidth="0.8125"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
