import { withBasePath } from "@/lib/base-path";
import React from "react";

const HeroSection = () => {
  return (
    <div
      className="bg-cover bg-bottom"
      style={{
        backgroundImage: `url(${withBasePath("/images/home-hero.svg")})`,
      }}
    >
      <div className="content-container flex w-full flex-col gap-[24px] py-[72px]">
        <div className="flex w-full items-center justify-center text-balance">
          <h1 className="text-text-04 font-serif text-[60px] leading-[70px] font-bold">
            ดาวน์โหลดข้อมูล
          </h1>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
