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
    <nav aria-label="breadcrumb" className="min-w-0">
      <ol className="text-link-01! flex min-w-0 items-center gap-[4px] text-[14px] whitespace-nowrap">
        {items.map((item, i) => (
          <li key={i} className="flex min-w-0 items-center gap-[4px]">
            {i > 0 && <span className="shrink-0">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                title={item.label}
                className="text-link-01! truncate no-underline!"
              >
                {item.label}
              </Link>
            ) : (
              <span title={item.label} className="truncate">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
