import type { Metadata } from "next";
import type { BudgetItem } from "@/types/budget";
import Header from "../components/shared/Header";
import AboutSection from "../components/shared/AboutSection";
import SearchHeader from "../components/Search/SearchHeader";

export const metadata: Metadata = {
  title: "ค้นหางบประมาณ | Thailand Open Budget",
  description: "ค้นหาและสำรวจข้อมูลงบประมาณแผ่นดินของประเทศไทย",
};

const mockHeaderSummaryInfo = {
  itemAmount: 124500,
  totalBudget: 348000,
  totalDepartment: 20,
};

export default function SearchPage() {
  return (
    <main className="mx-auto flex w-full flex-col gap-8">
      <Header />
      <div className="flex flex-col gap-2">
        <section className="px-[16px] py-[40px]">
          <SearchHeader summaryInfo={mockHeaderSummaryInfo} />
        </section>
      </div>
      <AboutSection />
    </main>
  );
}
