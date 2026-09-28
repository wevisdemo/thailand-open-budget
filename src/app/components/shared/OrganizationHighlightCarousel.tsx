import React from "react";
import Link from "next/link";
import { HIGHLIGHT_TITLES } from "@/constants/organization";
import type { OrganizationHighlight } from "@/types/organization";
import CardCarousel from "@/app/components/shared/CardCarousel";

interface OrganizationHighlightCarouselProps {
  // Names the row for screen readers, e.g. the heading above it.
  label: string;
  dataLabel: string;
  highlights: OrganizationHighlight[];
  isLoading?: boolean;
}

interface CaseCardProps {
  title: string;
  dataLabel: string;
  highlight: OrganizationHighlight | null;
}

function CaseCardBody({ title, dataLabel, highlight }: CaseCardProps) {
  return (
    <>
      <div className="flex w-full flex-col gap-[12px] px-[16px] py-[24px]">
        <p className="text-text-01 font-serif text-[20px] leading-[28px] font-bold">
          {title}
        </p>
        <div className="flex flex-col">
          <div className="bg-ui-03 flex items-center justify-center gap-[4px] px-[8px] py-[6px]">
            <p className="text-gray-60 text-[14px] leading-[18px]">ปีงบฯ</p>
            <p className="text-gray-60 text-[14px] leading-[18px] font-semibold">
              {dataLabel}
            </p>
          </div>
          <div className="flex flex-col items-start bg-white p-[8px]">
            {highlight ? (
              <>
                <p className="text-text-01 font-serif text-[20px] leading-[28px] font-bold">
                  {highlight.name}
                </p>
                <p className="text-text-01 font-serif text-[20px] leading-[36px] font-bold">
                  {highlight.value}
                </p>
                <p className="text-gray-70 text-[12px] leading-[16px]">
                  {highlight.unit}
                </p>
              </>
            ) : (
              <>
                <div className="bg-ui-03 h-[28px] w-[200px] animate-pulse" />
                <div className="bg-ui-03 mt-[4px] h-[36px] w-[140px] animate-pulse" />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="border-ui-03 flex w-full items-center justify-center gap-[16px] border-t px-[24px] py-[12px]">
        <span className="text-interactive-01 text-[14px] leading-[18px] font-semibold">
          สำรวจ →
        </span>
      </div>
    </>
  );
}

// The whole card is one link to the highlighted organization's page. While
// the data loads there is nothing to link to yet, so the card is inert.
function CaseCard({ title, dataLabel, highlight }: CaseCardProps) {
  if (!highlight) {
    return (
      <div className="bg-ui-01 flex flex-1 flex-col items-start">
        <CaseCardBody title={title} dataLabel={dataLabel} highlight={null} />
      </div>
    );
  }

  return (
    <Link
      href={highlight.href}
      className="bg-ui-01 flex flex-1 flex-col items-start transition-colors hover:cursor-pointer hover:bg-[#E5E5E5]"
    >
      <CaseCardBody title={title} dataLabel={dataLabel} highlight={highlight} />
    </Link>
  );
}

// While loading, one placeholder per title holds the row's shape.
export default function OrganizationHighlightCarousel({
  label,
  dataLabel,
  highlights,
  isLoading = false,
}: OrganizationHighlightCarouselProps) {
  return (
    <CardCarousel label={label}>
      {isLoading
        ? Object.entries(HIGHLIGHT_TITLES).map(([id, title]) => (
            <CaseCard
              key={id}
              title={title}
              dataLabel={dataLabel}
              highlight={null}
            />
          ))
        : highlights.map((highlight) => (
            <CaseCard
              key={highlight.id}
              title={highlight.title}
              dataLabel={dataLabel}
              highlight={highlight}
            />
          ))}
    </CardCarousel>
  );
}
