import Link from "next/link";
import Image from "next/image";
import ArrowUpRightIcon from "@/app/components/shared/icons/arrow-up-right-icon";
import SearchCategoriesIcon from "@/app/components/shared/icons/search-categories-icon";
import DownloadIcon from "@/app/components/shared/icons/download-icon";
import WevisIcon from "@/app/components/shared/icons/wevis-icon";

interface FooterItem {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumnProps {
  icon?: React.ReactNode;
  title: string;
  items?: FooterItem[];
}

function FooterColumn({ icon, title, items }: FooterColumnProps) {
  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex w-full items-center gap-[8px] px-[16px] py-[8px]">
        {icon}
        <span className="text-text-04 text-[14px] leading-[18px] font-semibold whitespace-nowrap">
          {title}
        </span>
      </div>
      {items?.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="flex w-full items-center justify-between gap-2 py-[4px] pr-[8px] pl-[16px] md:px-[16px]"
        >
          <span className="text-text-03 text-[14px] leading-[18px] whitespace-nowrap">
            {item.label}
          </span>
          {item.external && (
            <ArrowUpRightIcon
              color="#a8a8a8"
              className="size-[13px] shrink-0"
            />
          )}
        </Link>
      ))}
    </div>
  );
}

function GithubIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 4C9.37 4 4 9.37 4 16c0 5.31 3.435 9.8 8.205 11.385.6.115.82-.26.82-.575 0-.285-.01-1.04-.015-2.045-3.338.725-4.043-1.61-4.043-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.235 1.84 1.235 1.07 1.835 2.807 1.305 3.49.995.115-.775.42-1.305.762-1.605-2.665-.305-5.465-1.335-5.465-5.935 0-1.31.47-2.385 1.235-3.225-.125-.305-.535-1.53.115-3.185 0 0 1.005-.32 3.3 1.23a11.5 11.5 0 0 1 3-.405c1.02 0 2.045.135 3 .405 2.29-1.55 3.29-1.23 3.29-1.23.655 1.655.245 2.88.12 3.185.77.84 1.23 1.915 1.23 3.225 0 4.61-2.805 5.625-5.48 5.925.43.37.815 1.105.815 2.23 0 1.61-.015 2.91-.015 3.305 0 .32.215.695.825.575C24.565 25.795 28 21.31 28 16c0-6.63-5.37-12-12-12z"
        fill="#ffffff"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 4C9.37 4 4 9.37 4 16c0 5.5 3.99 10.075 9.215 10.95v-7.745H10.43V16h2.785v-2.115c0-2.75 1.635-4.27 4.135-4.27 1.2 0 2.455.215 2.455.215v2.7h-1.38c-1.36 0-1.785.845-1.785 1.71V16h3.04l-.485 3.205h-2.555V26.95C21.01 26.075 25 21.5 25 16c0-6.63-5.37-12-12-12z"
        fill="#ffffff"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 4h12a6 6 0 0 1 6 6v12a6 6 0 0 1-6 6H10a6 6 0 0 1-6-6V10a6 6 0 0 1 6-6zm12 3.5A1.5 1.5 0 1 1 20.5 9 1.5 1.5 0 0 1 22 7.5zM16 10a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"
        fill="#ffffff"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.565 14.27 26.998 4.5h-2L17.7 13.04 11.96 4.5H4.5l8.835 12.835L4.5 27.5h2l7.59-9.226 6.06 9.226h7.46L18.565 14.27zm-2.737 3.166-.895-1.28L7.82 6.12h3.073l5.74 8.205.895 1.28 7.465 10.66h-3.073l-6.092-8.71z"
        fill="#ffffff"
      />
    </svg>
  );
}

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer
      className={`flex flex-col gap-[16px] bg-gray-100 px-[24px] py-[32px] md:px-[64px] ${className ?? ""}`}
    >
      <div className="flex w-full flex-col gap-[16px] md:flex-row md:items-start md:justify-between">
        <Image
          src="/icons/logo-footer.svg"
          alt="Open Budget"
          width={134}
          height={61}
          priority={false}
        />

        <div className="grid grid-cols-[repeat(2,auto)] gap-x-[8px] gap-y-0 lg:flex lg:flex-row lg:items-start">
          <FooterColumn
            icon={
              <SearchCategoriesIcon
                color="#ffffff"
                colorInner="#161616"
                className="size-[14px] shrink-0"
              />
            }
            title="สำรวจงบ"
            items={[
              {
                label: "ผ่านคีย์เวิร์ด",
                href: "/search?q=keyword",
                external: true,
              },
              {
                label: "ผ่านหน่วยงาน",
                href: "/search?q=agency",
                external: true,
              },
            ]}
          />
          <FooterColumn
            icon={
              <SearchCategoriesIcon
                color="#ffffff"
                colorInner="#161616"
                className="size-[14px] shrink-0"
              />
            }
            title="อ่านบทความ"
            items={[
              {
                label: "ปูพื้นฐานงบประมาณ 101",
                href: "/articles/101",
                external: true,
              },
              {
                label: "ประเด็นที่น่าสนใจ",
                href: "/articles/topics",
                external: true,
              },
            ]}
          />
          <FooterColumn
            icon={
              <DownloadIcon color="#ffffff" className="size-[16px] shrink-0" />
            }
            title="ดาวน์โหลด"
          />
          <FooterColumn
            icon={
              <Image
                src="/icons/wevis.svg"
                alt="About"
                width={16}
                height={16}
              />
            }
            title="เกี่ยวกับเรา"
            items={[
              {
                label: "ที่มาของโครงการ",
                href: "/about/source",
                external: true,
              },
              { label: "ข้อมูลในเว็บนี้", href: "/about/data", external: true },
              {
                label: "เกี่ยวกับ WeVis",
                href: "/about/wevis",
                external: true,
              },
            ]}
          />
        </div>

        <div className="flex flex-row gap-[32px] md:flex-col md:gap-[8px]">
          <div className="flex flex-col gap-[4px]">
            <span className="text-gray-30 text-[12px] leading-[16px]">
              ติดต่อ
            </span>
            <Link
              href="mailto:info@punchup.world"
              className="flex items-center gap-[8px]"
            >
              <Image
                src="/icons/email.svg"
                alt=""
                width={16}
                height={16}
                aria-hidden
              />
              <span className="text-gray-30 text-[14px] leading-[18px]">
                info@punchup.world
              </span>
            </Link>
          </div>
          <div className="flex flex-col gap-[4px]">
            <span className="text-gray-30 text-[12px] leading-[16px]">
              ติดตาม
            </span>
            <div className="flex items-start gap-[8px]">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <GithubIcon />
              </Link>
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </Link>
              <Link
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                <XIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-gray-80 h-0 w-full border-t" />

      <p className="text-gray-10 text-[12px] leading-[16px]">
        ©Open Budget 2026
      </p>
    </footer>
  );
}
