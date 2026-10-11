import { Suspense } from "react";
import type { Metadata } from "next";
import { getBudgetaries } from "@/lib/organization-registry";
import BudgetaryTemplate from "@/app/components/Budgetary/BudgetaryTemplate";

interface BudgetaryPageProps {
  params: Promise<{ ministry_id: string; budgetary_id: string }>;
}

// The site is a static export: only units budgeted in some year are built,
// and any other id 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return getBudgetaries().map(({ ministry_id, budgetary_id }) => ({
    ministry_id: String(ministry_id),
    budgetary_id: String(budgetary_id),
  }));
}

function getBudgetary(budgetaryId: string) {
  return getBudgetaries().find(
    ({ budgetary_id }) => String(budgetary_id) === budgetaryId,
  );
}

export async function generateMetadata({
  params,
}: BudgetaryPageProps): Promise<Metadata> {
  const { budgetary_id } = await params;
  const name = getBudgetary(budgetary_id)?.budgetary_name ?? "";
  return {
    title: `${name} | Thailand Open Budget`,
    description: `สำรวจงบประมาณแผ่นดินของ${name}`,
  };
}

export default async function BudgetaryPage({ params }: BudgetaryPageProps) {
  const { ministry_id, budgetary_id } = await params;
  const budgetary = getBudgetary(budgetary_id);
  return (
    <Suspense>
      <BudgetaryTemplate
        ministryId={Number(ministry_id)}
        ministryName={budgetary?.ministry_name ?? ""}
        budgetaryId={Number(budgetary_id)}
        budgetaryName={budgetary?.budgetary_name ?? ""}
      />
    </Suspense>
  );
}
