export default function ChevronRightIcon({
  color,
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width="36"
      height="48"
      viewBox="0 0 36 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M33 24L18 39L15.9 36.9L28.8 24L15.9 11.1L18 9L33 24Z"
        fill={color ?? "#161616"}
      />
    </svg>
  );
}
