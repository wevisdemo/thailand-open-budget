"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";
import SearchIcon from "./icons/search-icon";
import CategoriesIcon from "./icons/categories-icon";
import DownAngleIcon from "./icons/down-angle-icon";
import { NavLinkItem } from "@/types/header";
import SearchCategoriesIcon from "./icons/search-categories-icon";

const rightLinks: { label: string; url: string }[] = [
  { label: "ดาวน์โหลด", url: "/download" },
  { label: "เกี่ยวกับเรา", url: "/about" },
];

const leftLinks: NavLinkItem[] = [
  {
    label: "สำรวจงบ",
    url: "/",
    icon: <SearchIcon color="white" />,
    menu: true,
    subMenu: [
      {
        label: "ผ่านคีย์เวิร์ด",
        url: "/search",
        icon: (
          <SearchCategoriesIcon
            color="white"
            colorInner="#2C2C2C"
            className="h-[14px] w-[14px]"
          />
        ),
      },
      // {
      //   label: "ผ่านหน่วยงาน",
      //   url: "/",
      //   icon: (
      //     <Image
      //       src={withBasePath("/icons/agency.svg")}
      //       alt="search-by-agency"
      //       width={14}
      //       height={14}
      //     />
      //   ),
      // },
    ],
  },
  {
    label: "อ่านบทความ",
    url: "/",
    icon: <CategoriesIcon color="white" />,
    menu: true,
    subMenu: [
      {
        label: "ปูพื้นฐานงบประมาณ 101",
        url: "https://wevis.info/tag/%e0%b8%87%e0%b8%9a%e0%b8%9b%e0%b8%a3%e0%b8%b0%e0%b8%a1%e0%b8%b2%e0%b8%93-101/",
        icon: (
          <Image
            src={withBasePath("/icons/iso.svg")}
            alt="search-by-iso"
            width={16}
            height={16}
          />
        ),
      },
      {
        label: "ประเด็นที่น่าสนใจ",
        url: "https://wevis.info/tag/บทความงบประมาณ/",
        icon: (
          <Image
            src={withBasePath("/icons/document.svg")}
            alt="search-by-document"
            width={14}
            height={14}
          />
        ),
      },
    ],
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenLabel(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const threshold = 8;
    let lastY = window.scrollY;

    function handleScroll() {
      const y = window.scrollY;

      if (y <= 0) {
        setVisible(true);
        lastY = y;
        return;
      }

      if (Math.abs(y - lastY) < threshold) return;

      const scrollingUp = y < lastY;
      setVisible(scrollingUp);
      lastY = y;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const forceVisible = menuOpen || openLabel !== null;

  return (
    <>
      <div className="h-[44px] md:h-[48px]" aria-hidden="true" />
      <header
        className={`fixed top-0 left-0 z-40 flex h-[44px] w-full items-center gap-[16px] bg-black px-[10px] transition-transform duration-300 md:h-[48px] md:justify-between md:px-[32px] ${
          visible || forceVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Mobile menu button */}
        <div className="relative md:hidden">
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            {menuOpen ? (
              <Image
                src={withBasePath("/icons/close.svg")}
                alt="menu"
                width={12}
                height={12}
              />
            ) : (
              <Image
                src={withBasePath("/icons/menu.svg")}
                alt="menu"
                width={12}
                height={12}
              />
            )}
          </button>

          {menuOpen && (
            <nav className="absolute top-[28px] left-[-10px] flex w-screen flex-col bg-[#222222]">
              {leftLinks.map(({ label, url, icon, menu, subMenu }, index) => {
                if (!menu || subMenu.length === 0) {
                  return (
                    <Link
                      key={index}
                      href={url}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-[12px] px-[16px] py-[11px] text-white hover:text-[#BFDBFEBF]"
                    >
                      {icon}
                      <span>{label}</span>
                    </Link>
                  );
                }

                return (
                  <div key={index} className="flex flex-col">
                    <div className="flex items-center gap-[12px] border-b border-[#414141] px-[16px] py-[24px] text-white">
                      {icon}
                      <span>{label}</span>
                    </div>

                    <div className="flex flex-col bg-[#222222] pl-[16px]">
                      {subMenu.map((item, index) => (
                        <Link
                          key={index}
                          href={item.url}
                          onClick={() => setMenuOpen(false)}
                          className="hover:bg-gray-80 flex items-center justify-between gap-[12px] border-b border-[#414141] py-[24px] pr-[16px] pl-[16px] text-white"
                        >
                          <div className="flex items-center gap-[12px]">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>

                          {label === "อ่านบทความ" && (
                            <Image
                              src={withBasePath("/icons/arrow-up-right.svg")}
                              alt="link"
                              width={13}
                              height={13}
                            />
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
              {rightLinks.map(({ label, url }) => (
                <Link
                  key={url}
                  href={url}
                  className="border-b border-[#414141] px-[15px] py-[24px] text-white hover:text-[#BFDBFEBF]"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src={withBasePath("/logo.svg")}
              alt="logo"
              width={156}
              height={18}
            />
          </Link>
          <nav ref={navRef} className="hidden gap-2 md:flex">
            {leftLinks.map(({ label, url, icon, menu, subMenu }, index) => {
              if (!menu || subMenu.length === 0) {
                return (
                  <Link
                    key={index}
                    href={url}
                    className="flex items-center gap-[8px] px-[16px] text-white hover:text-[#BFDBFEBF]"
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                );
              }

              const isOpen = openLabel === label;

              return (
                <div key={index} className="relative">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenLabel((prev) => (prev === label ? null : label))
                    }
                    className={`flex h-[44px] items-center gap-[8px] px-[16px] text-white hover:text-[#BFDBFEBF] md:h-[48px] ${isOpen ? "text-[#BFDBFEBF]" : ""}`}
                  >
                    {icon}
                    <span>{label}</span>
                    <DownAngleIcon color="white" />
                  </button>

                  {isOpen && (
                    <div
                      className={`bg-gray-90 absolute top-full left-0 z-30 flex w-max flex-col shadow-lg`}
                    >
                      {subMenu.map((item, index) => (
                        <Link
                          key={index}
                          href={item.url}
                          target={label === "อ่านบทความ" ? "_blank" : "_self"}
                          rel={
                            label === "อ่านบทความ"
                              ? "noopener noreferrer"
                              : undefined
                          }
                          onClick={() => setOpenLabel(null)}
                          className={`hover:bg-gray-80 flex items-center justify-between gap-[12px] py-[16px] pr-[16px] pl-[16px] text-white`}
                        >
                          <div className="flex items-center gap-[12px]">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>

                          {label === "อ่านบทความ" && (
                            <Image
                              src={withBasePath("/icons/arrow-up-right.svg")}
                              alt="link"
                              width={13}
                              height={13}
                            />
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Desktop nav */}
        <nav className="hidden gap-[24px] md:flex">
          {rightLinks.map(({ label, url }) => (
            <Link
              key={url}
              href={url}
              className="text-white hover:text-[#BFDBFEBF]"
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
