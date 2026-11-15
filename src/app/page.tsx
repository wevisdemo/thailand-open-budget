import { Suspense } from "react";
import type { Metadata } from "next";
import { getHomeHighlights } from "@/lib/organization-pages";
import HomeTemplate from "@/app/components/Homepage/HomeTemplate";

export const metadata: Metadata = {
  title: "ค้นหางบประมาณ | Thailand Open Budget",
  description: "ค้นหาและสำรวจข้อมูลงบประมาณแผ่นดินของประเทศไทย",
};

export default function HomePage() {
  return (
    <Suspense>
      <HomeTemplate highlights={getHomeHighlights()} />
    </Suspense>
  );
}
