import React from "react";

const DetailSection = () => {
  return (
    <section className="bg-white">
      <div className="content-container flex w-full flex-col gap-[48px] py-[64px]">
        <div className="flex w-full flex-col gap-[16px]">
          <h2 className="text-text-01 font-serif text-[28px] leading-[36px] font-bold">
            เกี่ยวกับเว็บไซต์นี้
          </h2>
          <div className="bg-gray-20 h-px w-full" />
        </div>

        <div className="text-text-01 flex w-full flex-col gap-[8px] text-[16px] leading-[22px]">
          <p>
            เงินภาษีของคุณ รัฐนำไปใช้ทำอะไรบ้าง ?
            ข้อมูลงบประมาณรายจ่ายที่มาจากภาษีของประชาชน
            ควรเป็นข้อมูลที่รัฐเปิดเผยอย่างโปร่งใส ตรวจสอบได้
            และประชาชนสามารถนำไปใช้งานต่อได้โดยง่าย
          </p>
          <p>
            อย่างไรก็ตาม ความเป็นจริงกลับตรงกันข้าม
            ข้อมูลงบประมาณในปัจจุบันยังถูกเผยแพร่ผ่านเอกสารงบประมาณรายจ่ายกว่า
            30 เล่ม ในรูปแบบที่เข้าถึงยาก ใช้งานต่อลำบาก
            และไม่เอื้อต่อการตรวจสอบของประชาชน
          </p>
          <p>
            WeVis ในฐานะกลุ่มเทคโนโลยีภาคประชาชน
            จึงขออาสาเข้ามาเยียวยาความเจ็บปวดนี้
            ผ่านการพัฒนาแพลตฟอร์มงบประมาณที่ช่วยให้คุณค้นหา ติดตาม
            และตั้งคำถามต่อการใช้งบประมาณของภาครัฐได้สะดวกยิ่งขึ้น
            เพื่อร่วมกันปกป้องภาษีทุกบาทของประชาชน
          </p>
        </div>

        <div className="text-text-01 flex w-full flex-col gap-[16px]">
          <h3 className="font-serif text-[20px] leading-[28px] font-bold">
            ทีมงานร่วมพัฒนา
          </h3>

          <div className="flex flex-col gap-[8px] text-[16px] leading-[22px]">
            <p className="font-semibold">เขียนโปรแกรม</p>
            <p>ทรงพล นิลวงษ์, พชร สังข์แก้ว</p>
          </div>

          <div className="flex flex-col gap-[8px] text-[16px] leading-[22px]">
            <p className="font-semibold">ออกแบบ</p>
            <p>ชินธิป เอกก้านตรง</p>
          </div>

          <div className="flex flex-col gap-[8px] text-[16px] leading-[22px]">
            <p className="font-semibold">จัดการและประมวลผลข้อมูล</p>
            <p>
              <a
                className="text-text-01 underline"
                href="https://github.com/napatswift"
                target="_blank"
                rel="noreferrer"
              >
                napatswift
              </a>
              , ปฏิภาณ ศรีชัย
            </p>
          </div>

          <div className="flex flex-col gap-[8px] text-[16px] leading-[22px]">
            <p className="font-semibold">ผู้จัดการโครงการ</p>
            <p>อาลาวีย์ วาแม</p>
          </div>

          <div className="flex flex-col gap-[8px] text-[16px] leading-[22px]">
            <p className="font-semibold">ที่ปรึกษาโครงการ</p>
            <p>
              น้ำใส ศุภวงศ์, ธนิสรา เรืองเดช,{" "}
              <a
                className="text-text-01 underline"
                href="https://github.com/Th1nkK1D"
                target="_blank"
                rel="noreferrer"
              >
                Th1nkK1D
              </a>
            </p>
          </div>
        </div>

        <div className="text-text-01 flex w-full flex-col gap-[16px]">
          <h3 className="font-serif text-[20px] leading-[28px] font-bold">
            หมายเหตุ
          </h3>
          <p className="text-[14px] leading-[20px]">
            โครงการนี้{" "}
            <a
              className="text-text-01 underline"
              href="https://wevis.info/"
              target="_blank"
              rel="noreferrer"
            >
              WeVis
            </a>{" "}
            ได้รับการสนับสนุนทุนในการดำเนินงานจาก{" "}
            <a
              className="text-text-01 underline"
              href="https://www.ned.org/"
              target="_blank"
              rel="noreferrer"
            >
              National Endowment for Democracy (NED)
            </a>{" "}
            และ{" "}
            <a
              className="text-text-01 underline"
              href="https://www.opensocietyfoundations.org/george-soros"
              target="_blank"
              rel="noreferrer"
            >
              Open Society Foundations
            </a>{" "}
            (OSF) ซึ่งนำมาใช้เป็นต้นทุนในการรวบรวมข้อมูล ออกแบบ พัฒนาเว็บไซต์
            ประสานงาน และบริหารจัดการโครงการ
          </p>
        </div>
      </div>
    </section>
  );
};

export default DetailSection;
