// Cuts `text` to at most `maxLength` characters, adding "…" when it was
// longer. The cut falls between grapheme clusters, so a Thai vowel or tone
// mark is never split from the consonant it sits on.
export function truncateText(text: string, maxLength: number): string {
  if ([...text].length <= maxLength) return text;

  const segmenter = new Intl.Segmenter("th", { granularity: "grapheme" });
  let result = "";
  let length = 0;
  for (const { segment } of segmenter.segment(text)) {
    const segmentLength = [...segment].length;
    if (length + segmentLength > maxLength) break;
    result += segment;
    length += segmentLength;
  }
  return `${result.trimEnd()}…`;
}
