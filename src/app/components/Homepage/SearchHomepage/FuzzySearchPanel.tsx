"use client";

import { useEffect, useRef, useState } from "react";
import SearchIcon from "@/app/components/shared/icons/search-icon";
import { withBasePath } from "@/lib/base-path";
import type { BudgetItem } from "@/types/budget";
import type {
  Organization,
  OrganizationSuggestion,
} from "@/types/organization";
import {
  MIN_QUERY_LENGTH,
  useOrganizationSearch,
} from "@/hooks/useOrganizationSearch";

interface FuzzySearchPanelProps {
  tags: { word: string }[];
  addTag: (word: string) => void;
  removeTag: (word: string) => void;
  data: string;
  budgetData: BudgetItem[];
  isLoading?: boolean;
}

interface HighlightedNameProps {
  name: string;
  ranges: [number, number][];
}

function HighlightedName({ name, ranges }: HighlightedNameProps) {
  if (ranges.length === 0) return <>{name}</>;

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  for (const [start, end] of ranges) {
    if (start < cursor) continue;
    if (start > cursor) parts.push(name.slice(cursor, start));
    parts.push(
      <span key={`${start}-${end}`} className="font-bold">
        {name.slice(start, end + 1)}
      </span>,
    );
    cursor = end + 1;
  }
  if (cursor < name.length) parts.push(name.slice(cursor));

  return <>{parts}</>;
}

export default function FuzzySearchPanel({
  tags,
  addTag,
  removeTag,
  data,
  budgetData,
  isLoading = false,
}: FuzzySearchPanelProps) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const groups = useOrganizationSearch(budgetData, input);
  // Groups render in sequence but keyboard navigation runs across all of them,
  // so each option carries its index in this flattened list.
  const flatSuggestions: OrganizationSuggestion[] = groups.flatMap(
    (group) => group.suggestions,
  );
  const hasQuery = input.trim().length >= MIN_QUERY_LENGTH;
  const showPanel = open && hasQuery;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleAdd(raw: string) {
    const word = raw.trim().replace(/,+$/, "").trim();
    if (word) addTag(word);
    setInput("");
    setActiveIndex(-1);
  }

  function navigateToOrganization(organization: Organization) {
    const url = `/organization/${encodeURIComponent(organization.id)}?budget_source=${data}`;
    window.location.href = withBasePath(url);
  }

  function navigateToSearch(raw: string) {
    const word = raw.trim().replace(/,+$/, "").trim();
    const words = [...tags.map((t) => t.word)];
    if (word && !words.includes(word)) words.push(word);
    const q = words.join(",");
    const url = q
      ? `/search?q=${encodeURIComponent(q)}&budget_source=${data}`
      : `/search?budget_source=${data}`;
    // Full-document navigation, NOT router.push. In the static export the App
    // Router client cache keys /search by pathname and restores the previously
    // cached query, so router.push("/search?q=<new>") lands back on the old
    // keyword. A real navigation loads /search fresh with the correct query.
    window.location.href = withBasePath(url);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const canNavigate = showPanel && flatSuggestions.length > 0;

    if (e.key === "ArrowDown" && canNavigate) {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % flatSuggestions.length);
      return;
    }
    if (e.key === "ArrowUp" && canNavigate) {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? flatSuggestions.length - 1 : i - 1));
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const active = canNavigate ? flatSuggestions[activeIndex] : undefined;
      if (active) {
        navigateToOrganization(active.organization);
      } else {
        navigateToSearch(input);
      }
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags[tags.length - 1].word);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setOpen(true);
    setActiveIndex(-1);
    if (val.endsWith(",")) {
      handleAdd(val);
    } else {
      setInput(val);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-stretch">
        <div
          className="border-ui-04 flex min-h-[48px] flex-1 items-center gap-[4px] border-b-[2px] bg-white px-[16px] py-[8px] hover:cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          <SearchIcon
            color="#525252"
            className="mr-[8px] h-[16px] w-[16px] shrink-0"
          />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(true)}
            placeholder="ลองค้นหาด้วย: กระทรวงมหาดไทย, กองทัพบก..."
            className="text-text-01 placeholder:text-text-03 min-w-[120px] flex-1 bg-transparent text-[14px] focus:outline-none"
            role="combobox"
            aria-expanded={showPanel}
            aria-controls="organization-suggestions"
            aria-autocomplete="list"
            aria-activedescendant={
              flatSuggestions[activeIndex]
                ? `organization-option-${activeIndex}`
                : undefined
            }
          />
        </div>
      </div>

      {showPanel && (
        <div className="absolute right-0 left-0 z-10 max-h-[360px] overflow-y-auto bg-white shadow-[0_2px_4px_rgba(0,0,0,0.16)]">
          {isLoading ? (
            <p className="text-text-02 px-[16px] py-[14px] text-[14px]">
              กำลังโหลดข้อมูลหน่วยงาน...
            </p>
          ) : flatSuggestions.length === 0 ? (
            <div className="flex flex-col gap-[8px] px-[16px] py-[14px]">
              <p className="text-text-01 text-[16px]">ไม่พบหน่วยงานนี้</p>
              <p className="text-text-02 text-[12px]">
                ตรวจสอบตัวสะกด หรือลองใช้คำอื่นที่เกี่ยวข้อง
              </p>
            </div>
          ) : (
            <ul id="organization-suggestions" role="listbox">
              {groups.map((group) => (
                <li key={group.level}>
                  <p className="bg-ui-03 text-text-02 px-[16px] py-[8px] text-[14px] leading-[18px]">
                    {group.label}
                  </p>
                  <ul>
                    {group.suggestions.map((suggestion) => {
                      const index = flatSuggestions.indexOf(suggestion);
                      const { organization } = suggestion;
                      return (
                        <li key={organization.id}>
                          <button
                            type="button"
                            id={`organization-option-${index}`}
                            role="option"
                            aria-selected={index === activeIndex}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => navigateToOrganization(organization)}
                            className={`flex w-full flex-col items-start gap-[2px] px-[16px] py-[12px] text-left hover:cursor-pointer ${
                              index === activeIndex ? "bg-ui-01" : "bg-white"
                            }`}
                          >
                            <span className="text-text-01 text-[14px] leading-[18px]">
                              <HighlightedName
                                name={organization.name}
                                ranges={suggestion.matchIndices}
                              />
                            </span>
                            {organization.ministry && (
                              <span className="text-text-02 text-[12px] leading-[16px]">
                                {organization.ministry}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
