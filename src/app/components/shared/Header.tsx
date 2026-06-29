"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/base-path";
import SearchIcon from "./icons/search-icon";
import CategoriesIcon from "./icons/categories-icon";
import DownAngleIcon from "./icons/down-angle-icon";
import { NavLinkItem } from "@/types/header";

const rightLinks: { label: string; url: string }[] = [
  { label: "ดาวน์โหลด", url: "/" },
  { label: "เกี่ยวกับเรา", url: "/about" },
];

const leftLinks: NavLinkItem[] = [
  {
    label: "สำรวจงบ",
    url: "/",
    icon: <SearchIcon color="white" />,
    menu: true,
    subMenu: [
      { label: "ผ่านคีย์เวิร์ด", url: "/", icon: <SearchIcon color="white" /> },
      { label: "ผ่านหน่วยงาน", url: "/", icon: <SearchIcon color="white" /> },
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
        url: "/",
        icon: <SearchIcon color="white" />,
      },
      {
        label: "ประเด็นที่น่าสนใจ",
        url: "/",
        icon: <SearchIcon color="white" />,
      },
    ],
  },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState<string[]>([]);
  const navRef = useRef<HTMLDivElement>(null);

  function toggleMobile(label: string) {
    setMobileOpen((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenLabel(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="relative z-20 flex h-[44px] items-center justify-between bg-black px-[10px] md:h-[58px] md:px-[32px]">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image
            src={withBasePath("logo.svg")}
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
                  className={`flex h-[44px] items-center gap-[8px] px-[16px] text-white hover:underline md:h-[58px] ${isOpen ? "underline" : ""}`}
                >
                  {icon}
                  <span>{label}</span>
                  <DownAngleIcon color="white" />
                </button>

                {isOpen && (
                  <div className="bg-gray-90 absolute top-full left-0 flex w-max flex-col py-[8px] shadow-lg">
                    {subMenu.map((item, index) => (
                      <Link
                        key={index}
                        href={item.url}
                        onClick={() => setOpenLabel(null)}
                        className="hover:bg-gray-80 flex items-center justify-between gap-[12px] py-[11px] pr-[16px] pl-[32px] text-white"
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

      {/* Mobile menu button */}
      <div className="relative md:hidden">
        <button onClick={() => setMenuOpen((prev) => !prev)}>
          {menuOpen ? (
            <Image
              src={withBasePath("/icons/close.svg")}
              alt="menu"
              width={13}
              height={13}
            />
          ) : (
            <Image
              src={withBasePath("/icons/menu.svg")}
              alt="menu"
              width={24}
              height={24}
            />
          )}
        </button>

        {menuOpen && (
          <nav className="absolute top-full right-[-10px] flex w-screen flex-col bg-black">
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

              const isOpen = mobileOpen.includes(label);

              return (
                <div key={index} className="flex flex-col">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleMobile(label)}
                    className="flex items-center justify-between gap-[8px] px-[16px] py-[24px] text-white"
                  >
                    <div className="flex items-center gap-[12px]">
                      {icon}
                      <span>{label}</span>
                    </div>
                    <span>
                      <DownAngleIcon color="white" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="bg-gray-90 flex flex-col">
                      {subMenu.map((item, index) => (
                        <Link
                          key={index}
                          href={item.url}
                          onClick={() => setMenuOpen(false)}
                          className="hover:bg-gray-80 flex items-center justify-between gap-[12px] py-[24px] pr-[16px] pl-[32px] text-white"
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
            {rightLinks.map(({ label, url }) => (
              <Link
                key={url}
                href={url}
                className="px-[15px] py-[24px] text-center text-white hover:text-[#BFDBFEBF]"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
