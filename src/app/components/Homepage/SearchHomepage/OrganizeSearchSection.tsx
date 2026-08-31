"use client";

import type { Tag } from "@/types/search";
import SearchPanel from "./SearchPanel";
import TagList from "./TagList";
import SearchCategoriesIcon from "../../shared/icons/search-categories-icon";
import FuzzySearchPanel from "./FuzzySearchPanel";
import OrganizationCategoriesIcon from "../../shared/icons/organization-categaries-icon";

interface OrganizeSearchSectionProps {
  tags: Tag[];
  addTag: (word: string) => void;
  removeTag: (word: string) => void;
  data: string;
}

export default function OrganizeSearchSection({
  tags,
  addTag,
  removeTag,
  data,
}: OrganizeSearchSectionProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[8px]">
      <div className="mb-[16px] flex flex-col items-start justify-between gap-[8px] md:flex-row md:items-center">
        <div className="flex gap-[8px] md:items-center">
          <OrganizationCategoriesIcon
            color="#161616"
            className="mt-2 md:mt-0"
          />
          <h2 className="text-text-01 font-serif text-[28px] font-bold text-balance md:text-[42px]">
            สำรวจงบประมาณผ่านหน่วยงาน
          </h2>
        </div>
        <p className="text-b4 text-text-01">
          ค้นหางบประมาณผ่านหน่วยงานที่คุณสนใจ
          <br />
          ตั้งแต่กระทรวงจนถึงหน่วยงานในพื้นที่
          <br />
          เพื่อดูว่าเงินภาษีถูกจัดสรรไปทำอะไร
        </p>
      </div>

      <FuzzySearchPanel
        tags={tags}
        addTag={addTag}
        removeTag={removeTag}
        data={data}
      />
    </div>
  );
}
