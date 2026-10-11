import { Suspense } from "react";
import type { Metadata } from "next";
import { getMinistries } from "@/lib/organization-registry";
import MinistryTemplate from "@/app/components/Ministry/MinistryTemplate";

interface MinistryPageProps {
  params: Promise<{ ministry_id: string }>;
}

// The site is a static export: only the registry's ministries are built, and
// any other id 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return getMinistries().map(({ id }) => ({ ministry_id: String(id) }));
}

function getMinistryName(ministryId: string): string {
  return (
    getMinistries().find(({ id }) => String(id) === ministryId)?.name ?? ""
  );
}

export async function generateMetadata({
  params,
}: MinistryPageProps): Promise<Metadata> {
  const { ministry_id } = await params;
  const name = getMinistryName(ministry_id);
  return {
    title: `${name} | Thailand Open Budget`,
    description: `สำรวจงบประมาณแผ่นดินของ${name}และหน่วยงานในสังกัด`,
  };
}

export default async function MinistryPage({ params }: MinistryPageProps) {
  const { ministry_id } = await params;
  return (
    <Suspense>
      <MinistryTemplate
        ministryId={Number(ministry_id)}
        ministryName={getMinistryName(ministry_id)}
      />
    </Suspense>
  );
}
