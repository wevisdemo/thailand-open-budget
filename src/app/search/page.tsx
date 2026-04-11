import type { Metadata } from "next";
import type { BudgetItem } from "@/types/budget";
import Header from "../components/shared/Header";

export const metadata: Metadata = {
  title: "ค้นหางบประมาณ | Thailand Open Budget",
  description: "ค้นหาและสำรวจข้อมูลงบประมาณแผ่นดินของประเทศไทย",
};

export default function SearchPage() {
  return (
    <main className="mx-auto flex w-full flex-col gap-8">
      <Header />
      <div className="flex flex-col gap-2"></div>
    </main>
  );
}
