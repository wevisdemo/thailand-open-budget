import Link from "next/link";
import Image from "next/image";
import ArrowUpRightIcon from "@/app/components/shared/icons/arrow-up-right-icon";
import SearchCategoriesIcon from "@/app/components/shared/icons/search-categories-icon";
import DownloadIcon from "@/app/components/shared/icons/download-icon";
import WevisIcon from "@/app/components/shared/icons/wevis-icon";
import { withBasePath } from "@/lib/base-path";

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
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noreferrer" : undefined}
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
        d="M16.0001 2.00008C12.6764 2.00053 9.46124 3.18346 6.9298 5.33728C4.39836 7.49109 2.71576 10.4753 2.18301 13.756C1.65025 17.0368 2.30207 20.4 4.02189 23.2442C5.74171 26.0884 8.41732 28.2279 11.5701 29.2801C12.2701 29.4101 12.5701 28.9801 12.5701 28.6101C12.5701 28.2401 12.5701 27.4001 12.5701 26.2301C8.6801 27.0701 7.8601 24.3501 7.8601 24.3501C7.58655 23.4929 7.01082 22.7644 6.2401 22.3001C4.9701 21.4401 6.3401 21.4501 6.3401 21.4501C6.7837 21.5128 7.20712 21.676 7.57801 21.9273C7.9489 22.1786 8.25745 22.5113 8.4801 22.9001C8.86744 23.5948 9.51484 24.1073 10.2799 24.3248C11.045 24.5423 11.8652 24.4471 12.5601 24.0601C12.6166 23.3506 12.9294 22.6858 13.4401 22.1901C10.3401 21.8301 7.0701 20.6301 7.0701 15.2701C7.04743 13.878 7.56333 12.5309 8.5101 11.5101C8.08156 10.3043 8.13167 8.98006 8.6501 7.81008C8.6501 7.81008 9.8201 7.43008 12.5001 9.24008C14.7916 8.61503 17.2086 8.61503 19.5001 9.24008C22.1701 7.43008 23.3401 7.81008 23.3401 7.81008C23.8585 8.98006 23.9086 10.3043 23.4801 11.5101C24.4269 12.5309 24.9428 13.878 24.9201 15.2701C24.9201 20.6501 21.6501 21.8301 18.5301 22.1801C18.8643 22.5188 19.122 22.9253 19.2859 23.3721C19.4498 23.8189 19.516 24.2956 19.4801 24.7701C19.4801 26.6401 19.4801 28.1501 19.4801 28.6101C19.4801 29.0701 19.7301 29.4201 20.4801 29.2801C23.637 28.2266 26.3154 26.083 28.035 23.2335C29.7545 20.3841 30.4027 17.0153 29.8634 13.7313C29.3241 10.4472 27.6325 7.46266 25.092 5.31285C22.5514 3.16304 19.3281 1.98859 16.0001 2.00008Z"
        fill="#C6C6C6"
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
        d="M16.055 2C8.24669 2 2 8.272 2 16.112C2 23.168 7.13121 28.992 13.8241 30V20.144H10.2545V16.112H13.8241V12.976C13.8241 9.392 15.9435 7.488 19.1784 7.488C20.74 7.488 22.3017 7.712 22.3017 7.712V11.184H20.517C18.7322 11.184 18.1744 12.304 18.1744 13.424V16.112H22.0786L21.4093 20.144H18.1744V30C24.8673 28.992 29.9985 23.056 29.9985 16.112C30.1101 8.272 23.8634 2 16.055 2Z"
        fill="#C6C6C6"
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
        d="M22.4056 11.0344C23.2009 11.0344 23.8456 10.3897 23.8456 9.5944C23.8456 8.79911 23.2009 8.1544 22.4056 8.1544C21.6103 8.1544 20.9656 8.79911 20.9656 9.5944C20.9656 10.3897 21.6103 11.0344 22.4056 11.0344Z"
        fill="#C6C6C6"
      />
      <path
        d="M16 9.8378C14.7812 9.8378 13.5898 10.1992 12.5765 10.8763C11.5631 11.5534 10.7733 12.5158 10.3069 13.6418C9.84047 14.7678 9.71844 16.0068 9.9562 17.2022C10.194 18.3975 10.7809 19.4955 11.6427 20.3573C12.5045 21.2191 13.6025 21.806 14.7978 22.0438C15.9932 22.2816 17.2322 22.1595 18.3582 21.6931C19.4842 21.2267 20.4466 20.4369 21.1237 19.4235C21.8008 18.4102 22.1622 17.2188 22.1622 16C22.1622 14.3657 21.513 12.7983 20.3573 11.6427C19.2017 10.487 17.6343 9.8378 16 9.8378ZM16 20C15.2089 20 14.4355 19.7654 13.7777 19.3259C13.1199 18.8864 12.6072 18.2616 12.3045 17.5307C12.0017 16.7998 11.9225 15.9956 12.0769 15.2196C12.2312 14.4437 12.6122 13.731 13.1716 13.1716C13.731 12.6122 14.4437 12.2312 15.2196 12.0769C15.9956 11.9225 16.7998 12.0017 17.5307 12.3045C18.2616 12.6072 18.8864 13.1199 19.3259 13.7777C19.7654 14.4355 20 15.2089 20 16C20 17.0609 19.5786 18.0783 18.8284 18.8284C18.0783 19.5786 17.0609 20 16 20Z"
        fill="#C6C6C6"
      />
      <path
        d="M16 6.1622C19.2041 6.1622 19.5837 6.1744 20.849 6.2322C21.61 6.24126 22.3637 6.38103 23.0773 6.6454C23.5948 6.84509 24.0648 7.15087 24.457 7.5431C24.8492 7.93532 25.155 8.4053 25.3547 8.9228C25.6191 9.63641 25.7588 10.3901 25.7679 11.1511C25.8256 12.4164 25.8379 12.796 25.8379 16.0001C25.8379 19.2042 25.8257 19.5838 25.7679 20.8491C25.7588 21.6101 25.6191 22.3638 25.3547 23.0774C25.155 23.5949 24.8492 24.0649 24.457 24.4571C24.0648 24.8493 23.5948 25.1551 23.0773 25.3548C22.3637 25.6192 21.61 25.7589 20.849 25.768C19.5838 25.8257 19.2044 25.838 16 25.838C12.7956 25.838 12.4162 25.8258 11.151 25.768C10.39 25.7589 9.63631 25.6192 8.9227 25.3548C8.4052 25.1551 7.93522 24.8493 7.543 24.4571C7.15077 24.0649 6.84499 23.5949 6.6453 23.0774C6.38093 22.3638 6.24116 21.6101 6.2321 20.8491C6.1744 19.5838 6.1621 19.2042 6.1621 16.0001C6.1621 12.796 6.1743 12.4164 6.2321 11.1511C6.24116 10.3901 6.38093 9.63641 6.6453 8.9228C6.84497 8.40528 7.15076 7.93529 7.54298 7.54304C7.93521 7.1508 8.40519 6.845 8.9227 6.6453C9.63631 6.38093 10.39 6.24116 11.151 6.2321C12.4163 6.1744 12.7959 6.1622 16 6.1622ZM16 4C12.741 4 12.3323 4.0138 11.0524 4.0722C10.0571 4.09218 9.07229 4.28079 8.14 4.63C7.34273 4.93831 6.61868 5.4098 6.01424 6.01424C5.4098 6.61868 4.93831 7.34273 4.63 8.14C4.28073 9.07245 4.09213 10.0574 4.0722 11.0529C4.0138 12.3323 4 12.741 4 16C4 19.259 4.0138 19.6677 4.0722 20.9476C4.09214 21.9431 4.28075 22.928 4.63 23.8605C4.93831 24.6578 5.4098 25.3818 6.01424 25.9863C6.61868 26.5907 7.34273 27.0622 8.14 27.3705C9.07245 27.7198 10.0574 27.9084 11.0529 27.9283C12.3323 27.9862 12.741 28 16 28C19.259 28 19.6677 27.9862 20.9476 27.9278C21.9431 27.9079 22.928 27.7193 23.8605 27.37C24.6578 27.0617 25.3818 26.5902 25.9863 25.9858C26.5907 25.3813 27.0622 24.6573 27.3705 23.86C27.7198 22.9275 27.9084 21.9426 27.9283 20.9471C27.9862 19.6677 28 19.259 28 16C28 12.741 27.9862 12.3323 27.9278 11.0524C27.9078 10.0571 27.7192 9.07229 27.37 8.14C27.0616 7.34283 26.5901 6.61887 25.9857 6.01452C25.3812 5.41017 24.6572 4.93876 23.86 4.6305C22.9275 4.28124 21.9426 4.09264 20.9471 4.0727C19.6677 4.0138 19.259 4 16 4Z"
        fill="#C6C6C6"
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
        d="M18.4598 13.787L26.8792 4H24.8841L17.5735 12.4979L11.7345 4H5L13.8296 16.8503L5 27.1135H6.99525L14.7154 18.1394L20.8818 27.1135H27.6163L18.4593 13.787H18.4598ZM15.727 16.9635L14.8324 15.6839L7.71417 5.502H10.7788L16.5232 13.7191L17.4179 14.9987L24.885 25.6798H21.8204L15.727 16.964V16.9635Z"
        fill="#C6C6C6"
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
          src={withBasePath("/icons/logo-footer.svg")}
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
                href: "/search",
                external: false,
              },
              // {
              //   label: "ผ่านหน่วยงาน",
              //   href: "/search?q=agency",
              //   external: true,
              // },
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
                href: "https://wevis.info/tag/%e0%b8%87%e0%b8%9a%e0%b8%9b%e0%b8%a3%e0%b8%b0%e0%b8%a1%e0%b8%b2%e0%b8%93-101/",
                external: true,
              },
              {
                label: "ประเด็นที่น่าสนใจ",
                href: "https://wevis.info/tag/บทความงบประมาณ/",
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
                src={withBasePath("/icons/wevis.svg")}
                alt="About"
                width={16}
                height={16}
              />
            }
            title="เกี่ยวกับเรา"
            items={[
              {
                label: "ที่มาของโครงการ",
                href: "/about#detail",
                external: false,
              },
              {
                label: "ข้อมูลในเว็บนี้",
                href: "/about#detail-web",
                external: false,
              },
              {
                label: "เกี่ยวกับ WeVis",
                href: "/about#detail-wevis",
                external: false,
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
                src={withBasePath("/icons/email.svg")}
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
                href="https://github.com/wevisdemo"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <GithubIcon />
              </Link>
              <Link
                href="https://www.facebook.com/wevisdemo/?locale=th_TH"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </Link>
              <Link
                href="https://www.instagram.com/wevisdemo/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </Link>
              <Link
                href="https://x.com/wevisdemo"
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
