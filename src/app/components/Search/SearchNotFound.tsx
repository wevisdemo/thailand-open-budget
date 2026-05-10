import Image from "next/image";
import SearchBodySkeleton from "@/app/components/Search/SearchBody/SearchBodySkeleton";
import type { Tag } from "@/types/search";

interface SearchNotFoundProps {
  tags: Tag[];
  onClear: () => void;
}

export default function SearchNotFound({ tags, onClear }: SearchNotFoundProps) {
  return (
    <div className="relative">
      <div className="flex w-full flex-col items-center justify-center">
        <SearchBodySkeleton />
        <p className="text-text-03 mt-[16px]">
          ข้อมูลรายโครงการจะปรากฏขึ้นเมื่อคุณเริ่มค้นหา
        </p>
      </div>
      <div className="absolute inset-0 flex flex-col items-center gap-[20px] bg-black/40">
        <Image
          src="/icons/search-not-found.svg"
          alt="search not found"
          width={36}
          height={36}
          className="mt-[96px]"
        />
        <p className="font-serif text-[42px] font-bold text-white">
          ไม่พบข้อมูลที่เกี่ยวข้องกับ &apos;{tags.map((t) => t.word).join(" ")}
          &apos;
        </p>
        <p className="text-[16px] text-white">ลองใช้คำอื่นที่เกี่ยวข้อง</p>
        <button
          onClick={onClear}
          className="bg-interactive-01 px-[16px] py-[12px] font-bold text-white hover:cursor-pointer"
        >
          ล้างการค้นหา
        </button>
      </div>
    </div>
  );
}
