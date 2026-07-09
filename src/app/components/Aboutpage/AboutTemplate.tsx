"use client";
import React, { useState } from "react";
import Footer from "../shared/Footer";
import Breadcrumb from "../shared/Breadcrumb";
import HeroSection from "./AboutSection/HeroSection";
import DetailSection from "./AboutSection/DetailSection";
import DetailWebSection from "./AboutSection/DetailWebSection";
import DetailWevisSection from "./AboutSection/DetailWevisSection";

const AboutTemplate = () => {
  return (
    <main className="mx-auto flex w-full flex-col">
      <div className="border-gray-20 flex items-center justify-between border-b-[2px] bg-white px-[8px] py-[15px] md:px-[32px]">
        <Breadcrumb
          items={[
            { label: "หน้าหลัก", href: "/" },
            { label: "เกี่ยวกับเรา", href: "/about" },
          ]}
        />
      </div>
      <section>
        <HeroSection />
      </section>
      <section className="bg-white px-[24px]" id="detail">
        <DetailSection />
      </section>
      <section className="bg-white px-[24px]" id="detail-web">
        <DetailWebSection />
      </section>
      <section className="bg-white px-[24px]" id="detail-wevis">
        <DetailWevisSection />
      </section>
      <Footer />
    </main>
  );
};

export default AboutTemplate;
