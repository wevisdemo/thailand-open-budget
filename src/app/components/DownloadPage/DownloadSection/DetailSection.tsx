"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { BudgetDocument } from "@/types/budget";
import rawDocuments from "@/app/data/budget_index.json";

const documents = (rawDocuments as BudgetDocument[]) || [];

const PAGE_SIZE = 5;

const THAI_MONTHS = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

function formatThaiDate(value: string | null): string {
  if (!value) return "-";
  const [dayStr, monthStr, yearStr] = value.split("/");
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);
  if (!day || !month || !year) return value;
  const thaiYear = year + 543;
  const monthName = THAI_MONTHS[month - 1];
  if (!monthName) return value;
  return `${day} ${monthName} ${thaiYear}`;
}

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d="M26 24v4H6V24H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zM24 14l-1.41-1.41L17 18.17V2h-2v16.17l-5.58-5.59L8 14l8 8z" />
  </svg>
);

const ArrowUpRightIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d="M10 6v2h12.59L6 24.59 7.41 26 24 9.41V22h2V6H10z" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TriangleLeftIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d="M11 4v8L5 8z" />
  </svg>
);

const TriangleRightIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden
    className={className}
  >
    <path d="M5 4v8l6-4z" />
  </svg>
);

const DetailSection = () => {
  const totalPages = Math.max(1, Math.ceil(documents.length / PAGE_SIZE));
  const [currentPage, setCurrentPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return documents.slice(start, start + PAGE_SIZE);
  }, [currentPage]);

  const rangeStart = (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, documents.length);

  const goToPage = (page: number) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    setMenuOpen(false);
  };

  return (
    <section className="bg-white">
      <div className="content-container flex w-full flex-col gap-[48px] py-[64px]">
        <div className="flex w-full flex-col gap-[10px]">
          <h2 className="text-text-01 font-serif text-[28px] leading-[36px] font-bold">
            เกี่ยวกับข้อมูล
          </h2>
          <p className="text-text-01 font-serif text-[20px] leading-[28px] font-bold">
            ที่มาและข้อจำกัดข้อมูล
          </p>
          <div className="text-text-01 flex w-full flex-col gap-[10px] text-[14px] leading-[20px]">
            <p>
              ข้อมูลงบประมาณที่แสดงบนเว็บไซต์นี้ มาจากร่าง พ.ร.บ.
              งบประมาณรายจ่าย (ฉบับที่ 3 ขาว-แดง) และ พ.ร.บ. ประจำปีงบประมาณ
              (ฉบับที่ 3 ขาว-แดง) เผยแพร่โดย{" "}
              <a
                href="https://www.bb.go.th/topic.php?gid=543&mid=308#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-link-01 hover:text-link-02 underline"
              >
                สำนักงบประมาณ
              </a>
              และผ่านการแปลงข้อมูลผ่านโปรแกรมคอมพิวเตอร์ให้เป็นไฟล์ในรูปแบบ
              Machine-Readable ซึ่งได้รับการตรวจสอบความถูกต้องโดยทีมงาน
              ส่วนในการแสดงผลส่วนต่างๆ
              มาจากการค้นหาและตัดคำเบื้องต้นโดยคอมพิวเตอร์ข้อมูล
              โปรดตรวจสอบบริบทของผลลัพธ์อีกครั้งก่อนการใช้งาน
            </p>
            <ul className="list-inside list-disc">
              <p className="text-text-01 text-[14px] leading-[20px]">
                ขอบเขตของข้อมูลงบประมาณที่ใช้พัฒนา
              </p>
              <li>
                งบประมาณจากร่าง พ.ร.บ. งบประมาณรายจ่าย (ฉบับร่าง วาระ 1)
                ระหว่างปี 2568-ปีปัจจุบัน
              </li>
            </ul>
            <p>
              หากต้องการแจ้งข้อผิดพลาดหรือเสนอแนะเพิ่มเติม
              สามารถแจ้งทีมงานได้ที่ อีเมล{" "}
              <a
                href="mailto:team@wevis.info"
                className="text-link-01 hover:text-link-02 underline"
              >
                team@wevis.info
              </a>
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col">
          {/* Desktop table */}
          <div className="hidden w-full overflow-x-auto md:block">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <colgroup>
                <col className="w-[146px]" />
                <col />
                <col className="w-[205px]" />
                <col className="w-[221px]" />
                <col className="w-[260px]" />
              </colgroup>
              <thead>
                <tr className="bg-gray-20 text-text-01">
                  <th className="px-[16px] py-[16px] text-center text-[16px] leading-[22px] font-semibold">
                    ปีงบประมาณ
                  </th>
                  <th className="px-[16px] py-[16px] text-center text-[16px] leading-[22px] font-semibold">
                    รายการ
                  </th>
                  <th className="px-[16px] py-[16px] text-center text-[16px] leading-[22px] font-semibold">
                    สถานะ
                  </th>
                  <th className="px-[16px] py-[16px] text-center text-[16px] leading-[22px] font-semibold">
                    วันปรับปรุงข้อมูลล่าสุด
                  </th>
                  <th className="px-[16px] py-[16px] text-center text-[16px] leading-[22px] font-semibold">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((doc) => (
                  <tr
                    key={`${doc.year}-${doc.status}`}
                    className="bg-gray-10 text-text-01 border-gray-20 border-t"
                  >
                    <td className="px-[16px] py-[16px] text-center align-top text-[16px] leading-[22px] font-semibold whitespace-nowrap">
                      {doc.year}
                    </td>
                    <td className="px-[16px] py-[16px] align-top">
                      <div className="text-[16px] leading-[22px] font-semibold">
                        {doc.nick_name}
                      </div>
                      <div className="text-text-02 text-[14px] leading-[18px]">
                        {doc.full_name}
                      </div>
                    </td>
                    <td className="px-[16px] py-[16px] align-top text-[16px] leading-[22px] font-semibold">
                      {doc.status}
                    </td>
                    <td className="px-[16px] py-[16px] text-center align-top text-[16px] leading-[22px] whitespace-nowrap">
                      {formatThaiDate(doc.updated_date ?? null)}
                    </td>
                    <td className="px-[16px] py-[16px] align-top">
                      <div className="flex flex-col items-center gap-[10px]">
                        {doc.csv_url ? (
                          <a
                            href={doc.csv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-gray-20 text-gray-70 hover:bg-gray-10 flex items-center gap-[6px] border bg-white px-[15px] py-[9px] text-[14px] leading-[18px] whitespace-nowrap"
                          >
                            ดาวน์โหลดข้อมูล
                            <DownloadIcon className="size-[13px]" />
                          </a>
                        ) : (
                          <span className="text-text-03 text-[14px] leading-[18px]">
                            -
                          </span>
                        )}
                        {doc.source_url && (
                          <a
                            href={doc.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-link-01 hover:text-link-02 flex items-center gap-[8px] text-[14px] leading-[18px] whitespace-nowrap"
                          >
                            ดูเอกสารต้นฉบับ
                            <ArrowUpRightIcon className="size-[13px]" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile document cards */}
          <div className="flex w-full flex-col gap-[16px] md:hidden">
            {documents.map((doc) => (
              <div
                key={`${doc.year}-${doc.status}`}
                className="bg-gray-10 text-text-01 flex flex-col"
              >
                <div className="flex items-stretch border-b border-black">
                  <div className="bg-gray-20 w-[120px] shrink-0 px-[16px] py-[16px] text-[16px] leading-[22px] font-semibold">
                    ปีงบประมาณ
                  </div>
                  <div className="px-[16px] py-[16px] text-[16px] leading-[22px] font-semibold whitespace-nowrap">
                    {doc.year}
                  </div>
                </div>
                <div className="flex items-stretch border-b border-black">
                  <div className="bg-gray-20 w-[120px] shrink-0 px-[16px] py-[16px] text-[16px] leading-[22px] font-semibold">
                    รายการ
                  </div>
                  <div className="px-[16px] py-[16px]">
                    <div className="text-[16px] leading-[22px] font-semibold">
                      {doc.nick_name}
                    </div>
                    <div className="text-text-02 text-[14px] leading-[18px]">
                      {doc.full_name}
                    </div>
                  </div>
                </div>
                <div className="flex items-stretch border-b border-black">
                  <div className="bg-gray-20 w-[120px] shrink-0 px-[16px] py-[16px] text-[16px] leading-[22px] font-semibold">
                    สถานะ
                  </div>
                  <div className="px-[16px] py-[16px] text-[16px] leading-[22px] font-semibold">
                    {doc.status}
                  </div>
                </div>
                <div className="flex items-stretch border-b border-black">
                  <div className="bg-gray-20 w-[120px] shrink-0 px-[16px] py-[16px] text-[16px] leading-[22px] font-semibold">
                    วันปรับปรุงข้อมูลล่าสุด
                  </div>
                  <div className="px-[16px] py-[16px] text-[16px] leading-[22px] whitespace-nowrap">
                    {formatThaiDate(doc.updated_date ?? null)}
                  </div>
                </div>
                <div className="flex items-stretch border-b border-black">
                  <div className="bg-gray-20 w-[120px] shrink-0 px-[16px] py-[16px] text-[16px] leading-[22px] font-semibold">
                    Link
                  </div>
                  <div className="px-[16px] py-[16px]">
                    <div className="flex flex-col items-start gap-[10px]">
                      {doc.csv_url ? (
                        <a
                          href={doc.csv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-gray-20 text-gray-70 hover:bg-gray-10 flex items-center gap-[6px] border bg-white px-[15px] py-[9px] text-[14px] leading-[18px] whitespace-nowrap"
                        >
                          ดาวน์โหลดข้อมูล
                          <DownloadIcon className="size-[13px]" />
                        </a>
                      ) : (
                        <span className="text-text-03 text-[14px] leading-[18px]">
                          -
                        </span>
                      )}
                      {doc.source_url && (
                        <a
                          href={doc.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-link-01 hover:text-link-02 flex items-center gap-[8px] text-[14px] leading-[18px] whitespace-nowrap"
                        >
                          ดูเอกสารต้นฉบับ
                          <ArrowUpRightIcon className="size-[13px]" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-10 border-gray-20 hidden items-center justify-between border-t md:flex">
            <p className="text-text-02 px-[16px] py-[12px] text-[14px] leading-[18px] whitespace-nowrap">
              {`${rangeStart} – ${rangeEnd} จาก `}
              <span className="text-text-01 font-bold">{documents.length}</span>
              {` รายการ`}
            </p>
            <div className="border-gray-20 flex items-center border-l">
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="text-text-01 flex items-center gap-[8px] px-[12px] py-[6px] text-[14px] leading-[18px] whitespace-nowrap"
                  aria-haspopup="listbox"
                  aria-expanded={menuOpen}
                >
                  {currentPage}
                  <ChevronDownIcon className="size-[12px]" />
                </button>
                {menuOpen && (
                  <ul
                    role="listbox"
                    className="border-gray-20 absolute right-0 z-10 mt-[4px] max-h-[240px] w-[80px] overflow-auto border bg-white py-[4px] shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <li key={page}>
                          <button
                            type="button"
                            onClick={() => goToPage(page)}
                            className={`flex w-full items-center justify-end px-[12px] py-[6px] text-right text-[14px] leading-[18px] ${
                              page === currentPage
                                ? "text-text-01 font-bold"
                                : "text-text-02 hover:bg-gray-10"
                            }`}
                          >
                            {page}
                          </button>
                        </li>
                      ),
                    )}
                  </ul>
                )}
              </div>
              <p className="text-text-01 text-[14px] leading-[18px] whitespace-nowrap">
                จาก {totalPages} หน้า
              </p>
              <div className="border-gray-20 mx-[4px] h-[20px] w-px" />
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="หน้าก่อนหน้า"
                className="text-text-01 border-gray-20 disabled:text-text-03 bg-gray-10 flex size-[48px] items-center justify-center border-r border-l hover:bg-white disabled:cursor-not-allowed"
              >
                <TriangleLeftIcon className="size-[12px]" />
              </button>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="หน้าถัดไป"
                className="text-text-01 disabled:text-text-03 bg-gray-10 flex size-[48px] items-center justify-center hover:bg-white disabled:cursor-not-allowed"
              >
                <TriangleRightIcon className="size-[12px]" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-[16px] bg-[#C6C6C6] px-[16px] py-[32px] md:px-[32px]">
          <p className="text-text-01 text-[20px] leading-[28px] font-semibold">
            ข้อตกลงในการใช้งาน (Terms of Use)
          </p>
          <p className="text-text-01 text-[16px] leading-[22px] text-balance">
            ทีมงานตั้งใจเปิดข้อมูลเป็น Open Data ภายใต้เงื่อนไข{" "}
            <a
              href="https://creativecommons.org/licenses/by-nc/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-01 underline"
            >
              Attribution-NonCommercial 4.0 International{" "}
            </a>
            ซึ่งหมายถึง สามารถนำข้อมูลไปใช้ ดัดแปลง ต่อยอดได้
            แต่ห้ามนำไปใช้ทางการค้าหรือแสวงหาผลกำไรจากผลงาน และต้องให้เครดิตกับ
            WeVis
          </p>
          <p className="text-text-01 text-[16px] leading-[22px] text-balance">
            ข้อมูลทั้งหมดภายในเว็บไซต์ถูกรวบจากเอกสารงบประมาณจากเว็บไซต์ของสำนักงบประมาณภายใต้ข้อจำกัดเรื่องคุณภาพของข้อมูลในหลากหลายด้าน
            ทาง WeVis ไม่สามารถรับผิดชอบต่อผลกระทบใด ๆ
            หากมีข้อมูลที่ผิดพลาดหรือไม่อัปเดตล่าสุด
            หากมีข้อสงสัยต้องการสอบถามเพิ่มเติม
            ประสงค์แจ้งเปลี่ยนแปลงหรือเพิ่มเติมข้อมูลเพื่อความถูกต้อง
            หรือมีข้อเสนอแนะใด ๆ สามารถติดต่อได้ที่ team@wevis.info
          </p>
          <p className="text-text-01 text-[16px] leading-[22px] text-balance">
            ด้าน Source Code ทางทีมมีความตั้งใจที่พัฒนาทุกโปรเจกต์ให้เป็น Open
            Source ภายใต้เงื่อนไข{" "}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-01 underline"
            >
              Attribution-NonCommercial-ShareAlike 4.0 International{" "}
            </a>
            ซึ่งหมายถึง สามารถนำผลงานไปใช้ ดัดแปลง ต่อยอดได้
            แต่ห้ามนำไปใช้ทางการค้าหรือแสวงหาผลกำไรจากผลงาน
            และต้องแจ้งทราบและให้เครดิตกับเจ้าของผลงาน
            โดยที่ผลงานที่เกิดขึ้นมาจะต้องอยู่ภายใต้เงื่อนไขแบบเดียวกันกับใบอนุญาต
            Creative Commons ของต้นฉบับ โดย WeVis Ltd. เป็นผู้อนุญาต (licensor)
          </p>
        </div>
      </div>
    </section>
  );
};

export default DetailSection;
