import React from "react";
import Image from "next/image";
import { Button } from "@carbon/react";
import { ArrowUpRight } from "@carbon/icons-react";
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
            <Button
              kind="primary"
              size="md"
              renderIcon={ArrowUpRight}
              onClick={() => {
                window.open(
                  "https://taejai.com/th/project/ots-open-budget-wevis",
                  "_blank",
                );
              }}
              className="bg-interactive-01 hover:bg-blue-70 gap-[4px] !pr-[16px] text-[14px] font-medium [&>svg]:!static"
            >
              บริจาค
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
