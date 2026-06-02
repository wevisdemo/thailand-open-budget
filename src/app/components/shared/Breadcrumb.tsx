import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="text-link-01! flex items-center gap-[4px] text-[14px]">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-[4px]">
            {i > 0 && <span>/</span>}
            {item.href ? (
              <Link href={item.href} className="text-link-01! no-underline!">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
