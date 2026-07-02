import { withBasePath } from "@/lib/base-path";
import React from "react";
import SearchCategoriesIcon from "../../shared/icons/search-categories-icon";
import Image from "next/image";
import CategoriesIcon from "../../shared/icons/categories-icon";

const NavigateSection = () => {
  return (
    <div className="flex flex-col items-center justify-center lg:flex-row">
      <a
        href="#search"
        className="border-ui-03 flex w-full cursor-pointer items-center justify-between gap-1 border-b px-[16px] py-[16px] lg:w-[300px] lg:flex-col lg:justify-center lg:border-b-0 lg:px-0 lg:py-[24px]"
      >
        <div className="flex items-center justify-center gap-2 lg:flex-col lg:gap-1">
          <SearchCategoriesIcon color="#161616" colorInner="#F4F4F4" />
          <div className="flex flex-col lg:gap-1 lg:text-center">
            <p className="text-text-02 text-b6 font-semibold">สำรวจงบผ่าน</p>
            <p className="text-text-01 text-h7 font-serif font-bold">
              คีย์เวิร์ด
            </p>
          </div>
        </div>
        <Image
          src={withBasePath("/icons/arrow-down.svg")}
          alt="arrow-down"
          width={16}
          height={16}
        />
      </a>
      <a
        href="#articles"
        className="flex w-full cursor-pointer items-center justify-between gap-1 px-[16px] py-[16px] lg:w-[300px] lg:flex-col lg:justify-center lg:px-0 lg:py-[24px]"
      >
        <div className="flex items-center justify-center gap-2 lg:flex-col lg:gap-1">
          <CategoriesIcon color="#161616" className="h-[30px] w-[30px]" />
          <div className="flex flex-col lg:gap-1 lg:text-center">
            <p className="text-text-02 text-b6 font-semibold">อ่าน</p>
            <p className="text-text-01 text-h7 font-serif font-bold">
              บทความงบฯ
            </p>
          </div>
        </div>
        <Image
          src={withBasePath("/icons/arrow-down.svg")}
          alt="arrow-down"
          width={16}
          height={16}
        />
      </a>
    </div>
  );
};

export default NavigateSection;
