import React from "react";
import { withBasePath } from "@/lib/base-path";

interface HeroSectionProps {
  itemAmount: number;
  totalBudgetAmount: number;
  totalMinistry: number;
  dropdownSelectedOption: string;
  year: string;
}

const HeroSection = ({
  itemAmount,
  totalBudgetAmount,
  totalMinistry,
  dropdownSelectedOption,
  year,
}: HeroSectionProps) => {
  return (
    <div
      className="relative bg-cover bg-center pt-[74px]"
      style={{
        backgroundImage: `url(${withBasePath("/images/bg-hero.png")})`,
      }}
    >
      <div className="mx-auto flex w-full max-w-[679px] flex-col items-center justify-center gap-[64px] px-[48px] text-balance md:px-0">
        <div className="flex flex-col gap-[16px]">
          <p className="text-text-01 text-h3 text-center font-serif font-bold">
            เงินภาษีที่คุณจ่าย
            <br />
            รัฐนำไปใช้ทำอะไรบ้าง?
          </p>
          <p className="text-text-01 text-b3 text-center font-semibold">
            ค้นหา ติดตาม และตั้งคำถามต่อการใช้งบของภาครัฐ
            <br />
            ให้งบประมาณที่คุณเป็นเจ้าของ เป็นเรื่องที่ตรวจสอบได้
          </p>
          <div className="flex flex-col items-center justify-center gap-[4px]">
            <p className="text-gray-60 text-b6 font-semibold">
              ข้อมูลงบประมาณที่ใช้ในเว็บไซต์นี้
            </p>
            <ul className="list-inside list-disc text-center">
              <li className="text-gray-60 text-b6">
                ฉบับร่างงบประมาณ (วาระ 1) ระหว่าง ปีงบฯ 2566 - ปัจจุบัน
              </li>
              <li className="text-gray-60 text-b6">
                ฉบับที่สภาอนุมัติ (วาระ 3) ระหว่าง ปีงบฯ 2569 - ปัจจุบัน
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full">
          <div className="bg-ui-03 py-2">
            <p className="text-text-02 text-b5 text-center">
              {year === (new Date().getFullYear() + 543).toString()
                ? `ข้อมูลล่าสุด ปีงบฯ`
                : "ปีงบฯ"}{" "}
              <br className="md:hidden" />
              <b className="font-semibold">{dropdownSelectedOption}</b>
            </p>
          </div>
          <div className="bg-ui-02 grid grid-cols-1 text-center md:grid-cols-3 md:text-left">
            <div className="border-ui-03 flex flex-col gap-1 border-b-[1px] px-6 py-4 md:border-r-[1px] md:border-b-0">
              <p className="text-text-02 text-b6">จำนวนรายการ</p>
              <p className="text-text-01 text-h7 font-bold">
                {itemAmount.toLocaleString()}+
              </p>
              <p className="text-text-02 text-b5">รายการ</p>
            </div>
            <div className="border-ui-03 flex flex-col gap-1 border-b-[1px] px-6 py-4 md:border-r-[1px] md:border-b-0">
              <p className="text-text-02 text-b6">งบประมาณทั้งหมด</p>
              <p className="text-text-01 text-h7 font-bold">
                {totalBudgetAmount.toLocaleString()}
              </p>
              <p className="text-text-02 text-b5">ล้านบาท</p>
            </div>
            <div className="flex flex-col gap-1 px-6 py-4">
              <p className="text-text-02 text-b6">หน่วยงานที่ได้รับงบประมาณ</p>
              <p className="text-text-01 text-h7 font-bold">
                {totalMinistry.toLocaleString()}
              </p>
              <p className="text-text-02 text-b5">หน่วยงาน</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
