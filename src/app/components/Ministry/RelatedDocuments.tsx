import { DocumentPdf } from "@carbon/icons-react";
import type { RelatedDocument } from "@/types/ministry";

interface RelatedDocumentsProps {
  documents: RelatedDocument[];
}

export default function RelatedDocuments({ documents }: RelatedDocumentsProps) {
  return (
    <div className="border-ui-03 flex flex-col gap-[8px] border p-[12px]">
      <h2 className="text-[14px] font-bold">ลิงก์ที่เกี่ยวข้อง</h2>
      <ul className="flex flex-col gap-[4px]">
        {documents.map(({ name, url }) => {
          // Keeps "เล่มที่ 3(4)" on one line, so a wrap falls before it.
          const [title, volume] = name.split(/ (?=เล่มที่)/);
          return (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-01! flex gap-[8px] text-[14px] leading-[18px] no-underline! hover:underline!"
              >
                <DocumentPdf size={16} className="mt-[1px] shrink-0" />
                <span>
                  {title}{" "}
                  {volume && (
                    <span className="whitespace-nowrap">{volume}</span>
                  )}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
