import SearchBodySkeleton from "@/app/components/Search/SearchBody/SearchBodySkeleton";
import SearchIcon from "@/app/components/shared/icons/search-icon";

export default function SearchEmptyState() {
  return (
    <div className="relative">
      <div className="flex w-full flex-col items-center justify-center">
        <SearchBodySkeleton />
        <p className="text-text-03 mt-[16px]">
          ข้อมูลรายโครงการจะปรากฏขึ้นเมื่อคุณเริ่มค้นหา
        </p>
      </div>
      <div className="absolute inset-0 flex flex-col items-center gap-[12px] bg-black/40">
        <SearchIcon color="white" className="mt-[96px] h-[36px] w-[36px]" />
        <p className="mt-[20] font-serif text-[42px] font-bold text-white">
          พิมพ์คีย์เวิร์ดที่สนใจในช่องค้นหาด้านบน
        </p>
      </div>
    </div>
  );
}
