import Image from "next/image";
import type { Tag } from "@/types/search";
import { withBasePath } from "@/lib/base-path";

interface TagListProps {
  tags: Tag[];
  removeTag: (word: string) => void;
}

export default function TagList({ tags, removeTag }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-[4px]">
      <span className="text-text-02 text-[14px]">คำค้นหาที่เลือกไว้: </span>
      {tags.map((tag) => (
        <span
          key={tag.word}
          style={{ backgroundColor: tag.color }}
          className="flex items-center gap-[6px] rounded-full px-[12px] py-[4px] text-[14px]"
        >
          {tag.word}
          <button
            type="button"
            onClick={() => removeTag(tag.word)}
            className="text-text-02 hover:text-text-01 leading-none hover:cursor-pointer"
            aria-label={`remove ${tag.word}`}
          >
            <Image
              src={withBasePath("/icons/cross.svg")}
              width={8}
              height={8}
              alt=""
            />
          </button>
        </span>
      ))}
    </div>
  );
}
