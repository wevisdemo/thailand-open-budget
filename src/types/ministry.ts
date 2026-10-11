import type { OrganizationCoreContent } from "@/types/organization";

export type CoreContentField = keyof OrganizationCoreContent;

// A CoreContent field ready to render: a numbered list when the sheet writes
// one, otherwise the text as written, line breaks kept.
export type CoreContentBlock =
  | { kind: "list"; items: string[] }
  | { kind: "text"; text: string };

// One budget document volume a ministry's items are printed in, linked to its
// PDF.
export interface RelatedDocument {
  name: string;
  url: string;
}
