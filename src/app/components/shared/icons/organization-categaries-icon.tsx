export default function OrganizationCategoriesIcon({
  color,
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M30 27.0536V29.1964H0V27.0536H30Z" fill={color} />
      <path
        d="M28.125 23.3036L28.125 25.4464L1.875 25.4464L1.875 23.3036L28.125 23.3036Z"
        fill={color}
      />
      <path
        d="M28.125 13.9286L28.125 16.0714L1.875 16.0714L1.875 13.9286L28.125 13.9286Z"
        fill={color}
      />
      <path
        d="M26.25 10.1786L26.25 12.3214L3.75 12.3214L3.75 10.1786L26.25 10.1786Z"
        fill={color}
      />
      <path
        d="M15 4.55359C17.2876 4.55359 18.9041 5.71614 19.9512 7.08149C20.9777 8.4204 21.5031 10.0018 21.6818 11.0742L19.5682 11.4258C19.4345 10.6235 19.0218 9.39182 18.252 8.38729C17.5022 7.40931 16.4619 6.69645 15 6.69645C13.5381 6.69645 12.4979 7.40931 11.7481 8.38729C10.9783 9.39182 10.5656 10.6235 10.4318 11.4258L8.31824 11.0742C8.49698 10.0018 9.02235 8.4204 10.0488 7.08149C11.096 5.71614 12.7124 4.55359 15 4.55359Z"
        fill={color}
      />
      <path d="M16.0714 0V5.625H13.9286V0H16.0714Z" fill={color} />
      <path d="M20.625 0V3.75H15V0H20.625Z" fill={color} />
      <path d="M10.4464 15V24.375H8.30359V15H10.4464Z" fill={color} />
      <path d="M16.0714 15V24.375H13.9286V15H16.0714Z" fill={color} />
      <path d="M21.6964 15V24.375H19.5536V15H21.6964Z" fill={color} />
      <path d="M27.3214 15V24.375H25.1786V15H27.3214Z" fill={color} />
      <path d="M4.82145 15V24.375H2.67859V15H4.82145Z" fill={color} />
    </svg>
  );
}
