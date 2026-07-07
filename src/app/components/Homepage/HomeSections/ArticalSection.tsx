"use client";
import React, { useEffect, useState } from "react";
import CategoriesIcon from "@/app/components/shared/icons/categories-icon";
import ArrowUpRightIcon from "@/app/components/shared/icons/arrow-up-right-icon";

interface ArticleCardData {
  id: string;
  image: string;
  date: string;
  title: string;
  link: string;
}

interface ArticleGroupData {
  id: string;
  title: string;
  subtitle: string;
  cards: ArticleCardData[];
  link: string;
  total: number | null;
}

const BASICS_ENDPOINT =
  "https://wevis.info/wp-json/wp/v2/posts?_embed=wp:featuredmedia&_fields=id,title,link,date,_links.wp:featuredmedia,_embedded.wp:featuredmedia.link&per_page=3&tags=152&_envelope=1";

const ISSUES_ENDPOINT =
  "https://wevis.info/wp-json/wp/v2/posts?_embed=wp:featuredmedia&_fields=id,title,link,date,_links.wp:featuredmedia,_embedded.wp:featuredmedia.link&per_page=3&tags=31&_envelope=1";

interface WpFeaturedMedia {
  source_url?: string;
}

interface WpPost {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  _embedded?: { "wp:featuredmedia"?: WpFeaturedMedia[] };
}

interface WpEnvelope {
  body: WpPost[];
  headers: { "X-WP-Total"?: string; "X-WP-TotalPages"?: string };
  status: number;
}

function formatPostDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][d.getUTCMonth()];
  return `${month} ${d.getUTCDate()},${d.getUTCFullYear()}`;
}

function mapPostsToCards(posts: WpPost[], idPrefix: string): ArticleCardData[] {
  return posts.map((post) => ({
    id: `${idPrefix}${post.id}`,
    image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
    date: formatPostDate(post.date),
    title: post.title.rendered,
    link: post.link,
  }));
}

const ISSUES_GROUP_META = {
  title: "ประเด็นที่น่าสนใจเกี่ยวกับงบประมาณ",
  subtitle: "ชวนอ่านบทความงบประมาณ",
  link: "https://wevis.info/tag/บทความงบประมาณ/",
};

interface ArticleCardProps {
  card: ArticleCardData;
}

function ArticleCard({ card }: ArticleCardProps) {
  return (
    <a
      href={card.link}
      className="bg-ui-01 flex w-[260px] max-w-[327.6666564941406px] shrink-0 snap-start flex-col gap-[18px] p-[16px] md:w-full md:flex-1 md:shrink"
    >
      <div className="relative aspect-4096/2150 w-full shrink-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.image}
          alt={card.title}
          className="pointer-events-none absolute inset-0 size-full object-cover"
        />
      </div>
      <div className="flex h-full w-full flex-col justify-between gap-[8px]">
        <div className="flex w-full flex-col gap-[13px]">
          <p className="text-text-primary text-[14px] leading-[18px]">
            {card.date}
          </p>
          <h3 className="text-text-primary font-serif text-[20px] leading-[28px] font-bold">
            {card.title}
          </h3>
        </div>
        <div className="flex w-full flex-col items-end gap-[8px]">
          <div className="bg-cool-gray-30 h-px w-full" />
          <ArrowUpRightIcon color="#161616" className="size-[16px]" />
        </div>
      </div>
    </a>
  );
}

function SeeAllLink({ link, total }: { link: string; total: number | null }) {
  return (
    <div className="flex w-full justify-end">
      <a
        target="_blank"
        href={link}
        className="text-link-01 underline-offset-from-font text-[14px] leading-[18px] underline decoration-solid"
      >
        {total ? `ดูทั้งหมด (${total}) →` : "ดูทั้งหมด →"}
      </a>
    </div>
  );
}

interface ArticleGroupProps {
  group: ArticleGroupData;
}

function ArticleGroup({ group }: ArticleGroupProps) {
  return (
    <div className="flex w-full flex-col gap-[16px]">
      <div className="flex w-full flex-col">
        <h2 className="text-text-01 font-serif text-[28px] leading-[36px] font-bold">
          {group.title}
        </h2>
        <p className="text-text-01 text-[16px] leading-[22px]">
          {group.subtitle}
        </p>
      </div>
      <div className="mr-[-24px] flex w-full flex-col gap-[8px]">
        <div className="flex w-full snap-x snap-mandatory gap-[14px] overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] md:snap-none md:overflow-visible [&::-webkit-scrollbar]:hidden">
          {group.cards.map((card) => (
            <ArticleCard key={card.id} card={card} />
          ))}
        </div>
        <SeeAllLink link={group.link} total={group.total} />
      </div>
    </div>
  );
}

function ArticalSection() {
  const [basicsCards, setBasicsCards] = useState<ArticleCardData[]>([]);
  const [issuesCards, setIssuesCards] = useState<ArticleCardData[]>([]);
  const [basicsTotal, setBasicsTotal] = useState<number | null>(null);
  const [issuesTotal, setIssuesTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(BASICS_ENDPOINT)
      .then((res) => (res.ok ? res.json() : null))
      .then((env: WpEnvelope | null) => {
        if (cancelled) return;
        const posts = env?.body ?? [];
        setBasicsCards(mapPostsToCards(posts, "b"));
        const total = Number(env?.headers?.["X-WP-Total"]);
        setBasicsTotal(Number.isFinite(total) ? total : null);
      })
      .catch(() => {
        if (!cancelled) {
          setBasicsCards([]);
          setBasicsTotal(null);
        }
      });

    fetch(ISSUES_ENDPOINT)
      .then((res) => (res.ok ? res.json() : null))
      .then((env: WpEnvelope | null) => {
        if (cancelled) return;
        const posts = env?.body ?? [];
        setIssuesCards(mapPostsToCards(posts, "i"));
        const total = Number(env?.headers?.["X-WP-Total"]);
        setIssuesTotal(Number.isFinite(total) ? total : null);
      })
      .catch(() => {
        if (!cancelled) {
          setIssuesCards([]);
          setIssuesTotal(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const groups: ArticleGroupData[] = [
    {
      id: "basics",
      title: "ปูพื้นฐานงบประมาณ 101",
      subtitle:
        "ชวนเข้าใจข้อมูลงบประมาณ รวมความรู้พื้นฐานก่อนสำรวจและตรวจสอบการใช้งบของภาครัฐ",
      cards: basicsCards,
      link: "https://wevis.info/tag/%e0%b8%87%e0%b8%9a%e0%b8%9b%e0%b8%a3%e0%b8%b0%e0%b8%a1%e0%b8%b2%e0%b8%93-101/",
      total: basicsTotal,
    },
    {
      id: "issues",
      title: ISSUES_GROUP_META.title,
      subtitle: ISSUES_GROUP_META.subtitle,
      link: ISSUES_GROUP_META.link,
      cards: issuesCards,
      total: issuesTotal,
    },
  ];

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-[24px]">
      <div className="flex w-full flex-col gap-[16px]">
        <div className="flex w-full flex-col items-start justify-between gap-[16px] md:flex-row md:items-center">
          <div className="flex gap-[8px] md:items-center">
            <CategoriesIcon
              color="#161616"
              className="mt-2 size-[30px] md:mt-0"
            />
            <h1 className="text-text-01 font-serif text-[42px] leading-[50px] font-bold">
              อ่านบทความงบประมาณ
            </h1>
          </div>
          <p className="text-text-01 max-w-[400px] text-[16px] leading-[22px]">
            อ่านเสริม เติมประเด็นเรื่องงบประมาณ
            ผ่านบทความปูพื้นฐานและบทวิเคราะห์การใช้งบฯ
          </p>
        </div>
        <div className="bg-cool-gray-30 h-px w-full" />
      </div>
      {groups.map((group) => (
        <ArticleGroup key={group.id} group={group} />
      ))}
    </section>
  );
}

export default ArticalSection;
