import React from "react";

function DetailWebSection() {
  return (
    <section className="bg-white">
      <div className="content-container flex w-full flex-col gap-[48px] py-[64px]">
        <div className="flex w-full flex-col gap-[16px]">
          <div className="flex flex-col items-start justify-between gap-[16px] md:flex-row md:items-center">
            <h2 className="text-text-01 font-serif text-[28px] leading-[36px] font-bold">
              เกี่ยวกับข้อมูลในเว็บไซต์
            </h2>
            <a
              className="border-decorative-01 text-icon-02 hover:bg-gray-10 flex h-[42px] shrink-0 items-center gap-[6px] border px-[15px] py-[9px] text-[12px] leading-[18px] font-medium whitespace-nowrap transition-colors"
              href="https://www.bb.go.th/topic.php?gid=543&mid=308#"
              target="_blank"
              rel="noreferrer"
            >
              ดาวน์โหลดข้อมูล
              <svg
                className="size-[13px]"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M3.5 9.5L9.5 3.5M9.5 3.5H4.5M9.5 3.5V8.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
          <div className="bg-gray-20 h-px w-full" />
        </div>

        <div className="text-text-01 flex w-full flex-col gap-[16px]">
          <h3 className="font-serif text-[20px] leading-[28px] font-bold">
            ที่มาและข้อจำกัดข้อมูล
          </h3>
          <div className="flex flex-col gap-[8px] text-[16px] leading-[22px]">
            <p>
              ข้อมูลงบประมาณที่แสดงบนเว็บไซต์นี้ มาจากร่าง พ.ร.บ.
              งบประมาณรายจ่าย (ฉบับที่ 3 ขาว-แดง) และ พ.ร.บ. ประจำปีงบประมาณ
              (ฉบับที่ 3 ขาว-แดง) เผยแพร่โดย{" "}
              <a
                className="text-text-01 underline"
                href="https://www.bb.go.th/topic.php?gid=543&mid=308#"
                target="_blank"
                rel="noreferrer"
              >
                สำนักงบประมาณ
              </a>{" "}
              และผ่านการแปลงข้อมูลผ่านโปรแกรมคอมพิวเตอร์ให้เป็นไฟล์ในรูปแบบ
              Machine-Readable ซึ่งได้รับการตรวจสอบความถูกต้องโดยทีมงาน
              ส่วนในการแสดงผลส่วนต่างๆ
              มาจากการค้นหาและตัดคำเบื้องต้นโดยคอมพิวเตอร์ข้อมูล
              โปรดตรวจสอบบริบทของผลลัพธ์อีกครั้งก่อนการใช้งาน
            </p>
            <div>
              <p>ขอบเขตของข้อมูลงบประมาณที่ใช้พัฒนา</p>
              <ul className="list-disc">
                <li className="ms-[24px] text-[14px] leading-[20px]">
                  งบประมาณจากร่าง พ.ร.บ. งบประมาณรายจ่าย (ฉบับร่าง วาระ 1)
                  ระหว่างปี 2568-ปีปัจจุบัน
                </li>
                {/* <li className="ms-[24px]">
                  งบประมาณจาก พ.ร.บ. งบประมาณรายจ่าย (ฉบับที่สภาอนุมัติแล้ว วาระ
                  3) ระหว่างปี 2569-ปีปัจจุบัน
                </li> */}
              </ul>
            </div>
          </div>
        </div>

        <div className="text-text-01 flex w-full flex-col gap-[16px]">
          <h3 className="font-serif text-[20px] leading-[28px] font-bold">
            กระบวนการจัดทำข้อมูล
          </h3>
          <div className="flex flex-col gap-[8px] text-[16px] leading-[22px]">
            <p>
              ในกรณีที่ข้อมูลต้นทางอยู่ในรูปแบบไฟล์เอกสาร PDF
              ข้อมูลจะถูกแปลงเป็นตารางด้วยวิธี OCR
              ในกรณีที่ข้อมูลต้นทางอยู่ในรูปแบบไฟล์เอกสาร Excel ข้อมูลจะถูกดึง
              (scrape) และนำมาจัดโครงสร้างใหม่ในรูปแบบ machine-readable
              จากนั้นข้อมูลจะถูกตรวจสอบความถูกต้องโดยทีมงาน
            </p>
            <p>
              อย่างไรก็ดี ข้อมูลอาจยังมีความคลาดเคลื่อน
              จึงแนะนำให้ตรวจสอบกับข้อมูลต้นทางก่อนนำไปใช้อ้างอิง
              หากพบข้อมูลที่ไม่ถูกต้องหรือไม่เป็นปัจจุบัน มีข้อสงสัย
              ต้องการสอบถาม แจ้งแก้ไขเพิ่มเติมข้อมูล หรือมีข้อเสนอแนะ
              สามารถติดต่อได้ที่{" "}
              <a
                className="text-text-01 underline"
                href="mailto:team@wevis.info"
              >
                team@wevis.info
              </a>
            </p>
          </div>
        </div>

        <div className="text-text-01 bg-gray-30 flex w-full flex-col gap-[16px] p-[32px]">
          <h3 className="font-serif text-[20px] leading-[28px] font-bold">
            ข้อตกลงในการใช้งาน (Terms of Use)
          </h3>
          <div className="flex flex-col gap-[8px] text-[16px] leading-[22px]">
            <p>
              ทีมงานตั้งใจเปิดข้อมูลเป็น Open Data ภายใต้เงื่อนไข{" "}
              <a
                className="text-text-01 underline"
                href="https://creativecommons.org/licenses/by-nc/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                Attribution-NonCommercial 4.0 International
              </a>{" "}
              ซึ่งหมายถึง สามารถนำข้อมูลไปใช้ ดัดแปลง ต่อยอดได้
              แต่ห้ามนำไปใช้ทางการค้าหรือแสวงหาผลกำไรจากผลงาน
              และต้องให้เครดิตกับ WeVis
            </p>
            <p>
              ข้อมูลทั้งหมดภายในเว็บไซต์ถูกรวบจากเอกสารงบประมาณจากเว็บไซต์ของสำนักงบประมาณภายใต้ข้อจำกัดเรื่องคุณภาพของข้อมูลในหลากหลายด้าน
              ทาง WeVis ไม่สามารถรับผิดชอบต่อผลกระทบใด ๆ
              หากมีข้อมูลที่ผิดพลาดหรือไม่อัปเดตล่าสุด
              หากมีข้อสงสัยต้องการสอบถามเพิ่มเติม
              ประสงค์แจ้งเปลี่ยนแปลงหรือเพิ่มเติมข้อมูลเพื่อความถูกต้อง
              หรือมีข้อเสนอแนะใดๆ สามารถติดต่อได้ที่ team@wevis.info
            </p>
            <p>
              ด้าน Source Code ทางทีมมีความตั้งใจที่พัฒนาทุกโปรเจกต์ให้เป็น Open
              Source ภายใต้เงื่อนไข{" "}
              <a
                className="text-text-01 underline"
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                Attribution-NonCommercial-ShareAlike 4.0 International
              </a>{" "}
              ซึ่งหมายถึง สามารถนำผลงานไปใช้ ดัดแปลง ต่อยอดได้
              แต่ห้ามนำไปใช้ทางการค้าหรือแสวงหาผลกำไรจากผลงาน
              และต้องแจ้งทราบและให้เครดิตกับเจ้าของผลงาน
              โดยที่ผลงานที่เกิดขึ้นมาจะต้องอยู่ภายใต้เงื่อนไขแบบเดียวกันกับใบอนุญาต
              Creative Commons ของต้นฉบับ โดย WeVis Ltd. เป็นผู้อนุญาต
              (licensor) ร่วมกัน
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DetailWebSection;
