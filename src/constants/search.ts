import type { BudgetItem } from "@/types/budget";
import type { Tag } from "@/types/search";

export const TAG_COLORS = [
  "#CDD3DA",
  "#BAE6FF",
  "#A7F0BA",
  "#FFD6E8",
  "#E8DAFF",
];

export const EXAMPLE_KEYWORDS = [
  "ก่อสร้าง",
  "ถนน",
  "สะพาน",
  "วิทยาศาสตร์",
  "เทคโนโลยี",
  "พระราชดำริ",
  "เฉลิมพระเกียรติ",
  "ท่องเที่ยว",
  "ฝึกอบรม",
  "ผู้สูงอายุ",
];

// Keywords as chips, each with its colour, which also marks its matches in
// the results.
export function toTags(words: string[]): Tag[] {
  return words.map((word, i) => ({
    word,
    color: TAG_COLORS[i % TAG_COLORS.length],
  }));
}

// Whether an item contains any of the keywords. Only the three item-level
// fields the table highlights are matched, so every hit is visible on the row
// it returns.
export function matchesAnyKeyword(item: BudgetItem, words: string[]): boolean {
  return words.some((word) => {
    const kw = word.toLowerCase();
    return (
      item.description.toLowerCase().includes(kw) ||
      item.output.toLowerCase().includes(kw) ||
      item.project.toLowerCase().includes(kw)
    );
  });
}
