"use client";

import React, { useEffect, useRef, useState } from "react";
import ChevronRightIcon from "../icons/chevron-right-icon";

interface CardCarouselProps {
  children: React.ReactNode;
  // Names the group of cards for screen readers, e.g. the heading above it.
  label: string;
  // Set to 3 when each card is a three-row subgrid (e.g. title, body, footer),
  // so those rows line up across cards whatever their content height.
  alignedRows?: 3;
}

const CARD_GAP = 12;

export default function CardCarousel({
  children,
  label,
  alignedRows,
}: CardCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function syncEdges() {
      if (!track) return;
      setAtStart(track.scrollLeft <= 0);
      setAtEnd(track.scrollLeft >= track.scrollWidth - track.clientWidth - 1);
    }

    syncEdges();
    track.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      track.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [children]);

  // A page is the visible width plus one gap: the next page starts a gap past
  // the track's right edge. Scroll snapping lands it on a card edge.
  function scrollByPage(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * (track.clientWidth + CARD_GAP),
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="group"
        aria-label={label}
        className={`${
          alignedRows
            ? "grid auto-cols-[100%] grid-flow-col grid-rows-[auto_1fr_auto] md:auto-cols-[calc((100%-24px)/3)]"
            : "flex items-stretch"
        } snap-x snap-mandatory gap-x-[12px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {React.Children.map(children, (child) => (
          // One card fills the track on phones; two share it from sm and three
          // from lg, less the 12px gaps between them.
          <div
            className={
              alignedRows
                ? "row-span-3 grid snap-start grid-rows-subgrid"
                : "flex w-full shrink-0 snap-start md:w-[calc((100%-24px)/3)]"
            }
          >
            {child}
          </div>
        ))}
      </div>
      {/* When every card fits, both edges are reached at once and neither
          arrow shows. */}
      {!atStart && (
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          aria-label="การ์ดก่อนหน้า"
          className="absolute top-[50%] left-0 z-10 flex h-[48px] w-[36px] -translate-y-[50%] items-center justify-center hover:cursor-pointer"
        >
          <ChevronRightIcon className="rotate-180" />
        </button>
      )}
      {!atEnd && (
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label="การ์ดถัดไป"
          className="absolute top-[50%] right-0 z-10 flex h-[48px] w-[36px] -translate-y-[50%] items-center justify-center hover:cursor-pointer"
        >
          <ChevronRightIcon />
        </button>
      )}
    </div>
  );
}
