import React from "react";
import Image from "next/image";
import ArrowRightIcon from "@/app/components/shared/icons/arrow-right-icon";
import { withBasePath } from "@/lib/base-path";

const SUPPORT_IMAGE = "/images/support.svg";

const SupportSection = () => {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between md:flex-row md:gap-[38px]">
      <div>
        <Image
          src={withBasePath(SUPPORT_IMAGE)}
          alt="Support"
          width={450}
          height={450}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-[8px] px-6 py-6 md:px-0 md:py-0">
        <h2 className="font-serif text-[28px] leading-[36px] font-bold text-[#161616]">
          ร่วมสนับสนุนเว็บไซต์นี้
        </h2>
        <div className="flex flex-col gap-[16px]">
          <p className="text-[16px] leading-[22px] text-[#161616]">
            ทุกการสนับสนุนของคุณ คือส่วนสำคัญให้ WeVis
            สามารถพัฒนาเครื่องมือสำหรับให้ประชาชนติดตามและตั้งคำถามต่อการใช้งบประมาณของรัฐต่อไป
          </p>
          <div className="flex w-full justify-end">
            <button
              onClick={() => {
                window.open(
                  "https://taejai.com/th/project/ots-open-budget-wevis",
                  "_blank",
                );
              }}
              type="button"
              className="bg-interactive-01 flex items-center gap-[6px] border border-[#e0e0e0] px-[15px] py-[9px]"
            >
              <span className="text-[12px] leading-[18px] font-medium text-white">
                บริจาค
              </span>
              <ArrowRightIcon color="#FFFFFF" className="size-[16px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
