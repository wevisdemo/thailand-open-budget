import { Suspense } from "react";
import type { Metadata } from "next";
import SearchTemplate from "@/app/components/Search/SearchTemplate";

export const metadata: Metadata = {
  title: "ค้นหางบประมาณ | Thailand Open Budget",
  description: "ค้นหาและสำรวจข้อมูลงบประมาณแผ่นดินของประเทศไทย",
};

export default function SearchPage() {
  return (
    <Suspense>
      <SearchTemplate />
    </Suspense>
  );
}
