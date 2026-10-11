// The "เรียงจาก…" note under a table's title. Number columns read small to
// large; text columns (`isText`) read ก-ฮ. With no column sorted the table
// keeps its own order, named by `unsortedLabel`.
export function getSortLabel(
  dir: "asc" | "desc" | null,
  {
    isText = false,
    unsortedLabel = "เรียงจาก ก-ฮ",
  }: { isText?: boolean; unsortedLabel?: string } = {},
): string {
  if (!dir) return unsortedLabel;
  if (isText) return dir === "asc" ? "เรียงจาก ก-ฮ" : "เรียงจาก ฮ-ก";
  return dir === "asc" ? "เรียงจากน้อยไปมาก" : "เรียงจากมากไปน้อย";
}
