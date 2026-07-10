import React from "react";
import { withBasePath } from "@/lib/base-path";

interface HeroSectionProps {
  itemAmount: number;
  totalBudgetAmount: number;
  totalMinistry: number;
  dropdownSelectedOption: string;
  year: string;
  isLoading?: boolean;
}

const HeroSection = ({
  itemAmount,
  totalBudgetAmount,
  totalMinistry,
  dropdownSelectedOption,
  year,
  isLoading = false,
}: HeroSectionProps) => {
  return (
    <div
      className="relative bg-cover bg-bottom pt-[74px] md:h-[calc(100vh-102px)] md:bg-center"
      style={{
        backgroundImage: `url(${withBasePath("/images/home-hero.svg")})`,
      }}
    >
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-[64px] px-[48px] text-balance md:h-full md:justify-between md:px-0">
        <div></div>
        <div className="flex max-w-[679px] flex-col gap-[16px]">
          <p className="text-text-04 text-h3 text-center font-serif font-bold">
            เงินภาษีที่คุณจ่าย
            <br />
            รัฐนำไปใช้ทำอะไรบ้าง?
          </p>
          <p className="text-text-04 text-b3 text-center font-semibold">
            ค้นหา ติดตาม และตั้งคำถามต่อการใช้งบของภาครัฐ
            <br />
            ให้งบประมาณที่คุณเป็นเจ้าของ เป็นเรื่องที่ตรวจสอบได้
          </p>
          <div className="flex flex-col items-center justify-center gap-[4px]">
            <p className="text-text-04 text-b6 font-semibold">
              ข้อมูลงบประมาณที่ใช้ในเว็บไซต์นี้
            </p>
            <ul className="w-full list-inside list-disc text-center">
              <li className="text-text-04 text-b6">
                ฉบับร่างงบประมาณ (วาระ 1) ระหว่าง ปีงบฯ 2568 - ปัจจุบัน
              </li>
              {/* <li className="text-gray-60 text-b6">
                ฉบับที่สภาอนุมัติ (วาระ 3) ระหว่าง ปีงบฯ 2569 - ปัจจุบัน
              </li> */}
            </ul>
          </div>
        </div>
        <div className="w-full max-w-[679px]">
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
              {isLoading ? (
                <div className="bg-ui-03 h-[28px] w-[100px] animate-pulse" />
              ) : (
                <p className="text-text-01 text-h7 font-bold">
                  {itemAmount.toLocaleString()}
                </p>
              )}
              <p className="text-text-02 text-b5">รายการ</p>
            </div>
            <div className="border-ui-03 flex flex-col gap-1 border-b-[1px] px-6 py-4 md:border-r-[1px] md:border-b-0">
              <p className="text-text-02 text-b6">งบประมาณทั้งหมด</p>
              {isLoading ? (
                <div className="bg-ui-03 h-[28px] w-[140px] animate-pulse" />
              ) : (
                <p className="text-text-01 text-h7 font-bold">
                  {totalBudgetAmount.toLocaleString()}
                </p>
              )}
              <p className="text-text-02 text-b5">ล้านบาท</p>
            </div>
            <div className="flex flex-col gap-1 px-6 py-4">
              <p className="text-text-02 text-b6">หน่วยงานที่ได้รับงบประมาณ</p>
              {isLoading ? (
                <div className="bg-ui-03 h-[28px] w-[80px] animate-pulse" />
              ) : (
                <p className="text-text-01 text-h7 font-bold">
                  {totalMinistry.toLocaleString()}
                </p>
              )}
              <p className="text-text-02 text-b5">หน่วยงาน</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
