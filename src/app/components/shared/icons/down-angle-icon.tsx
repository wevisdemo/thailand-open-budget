export default function DownAngleIcon({
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
      <path
        d="M8 10.9998L3 5.9998L3.7 5.2998L8 9.5998L12.3 5.2998L13 5.9998L8 10.9998Z"
        fill={color ?? "#161616"}
      />
    </svg>
  );
}
