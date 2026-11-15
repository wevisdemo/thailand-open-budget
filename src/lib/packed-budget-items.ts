import type {
  BudgetItem,
  PackedBudgetItem,
  PackedBudgetItems,
} from "@/types/budget";

// Joins a list field into the one string it is packed as. Neither the
// category levels nor the fiscal years contain it.
const LIST_SEPARATOR = "\u001f";

// A page_url is a PDF link ending in the page the item is on, e.g.
// "https://…/doc.pdf?#page=785". The link is shared by many items; the page
// number mostly isn't.
const PAGE_URL_PATTERN = /^(.*#page=)(\d+)$/;

function splitList(text: string): string[] {
  return text === "" ? [] : text.split(LIST_SEPARATOR);
}

// Packs items with their text in one string table. Unpacking gives back the
// same items, field for field.
export function packBudgetItems(list: BudgetItem[]): PackedBudgetItems {
  const strings: string[] = [];
  const indexes = new Map<string, number>();

  function toIndex(text: string): number {
    let index = indexes.get(text);
    if (index === undefined) {
      index = strings.length;
      strings.push(text);
      indexes.set(text, index);
    }
    return index;
  }

  function pack(item: BudgetItem): PackedBudgetItem {
    const pageMatch = item.page_url.match(PAGE_URL_PATTERN);
    return [
      toIndex(item.ministry),
      item.ministry_id,
      toIndex(item.budgetary),
      item.budgetary_id,
      toIndex(item.plan),
      toIndex(item.plan_prefix),
      toIndex(item.plan_suffix),
      toIndex(item.output),
      toIndex(item.project),
      toIndex(item.category),
      toIndex((item.category_levels ?? []).join(LIST_SEPARATOR)),
      toIndex(item.description),
      item.amount,
      toIndex(item.fiscal_year),
      toIndex(item.pdf_name),
      toIndex(pageMatch ? pageMatch[1] : item.page_url),
      pageMatch ? Number(pageMatch[2]) : null,
      item.total_fiscal_amount,
      toIndex(item.fiscal_year_list.join(LIST_SEPARATOR)),
    ];
  }

  return { strings, items: list.map(pack) };
}

export function unpackBudgetItems({
  strings,
  items,
}: PackedBudgetItems): BudgetItem[] {
  function unpack(item: PackedBudgetItem): BudgetItem {
    const [
      ministry,
      ministryId,
      budgetary,
      budgetaryId,
      plan,
      planPrefix,
      planSuffix,
      output,
      project,
      category,
      categoryLevels,
      description,
      amount,
      fiscalYear,
      pdfName,
      pageUrl,
      page,
      totalFiscalAmount,
      fiscalYearList,
    ] = item;
    return {
      fiscal_year: strings[fiscalYear],
      ministry: strings[ministry],
      ministry_id: ministryId,
      budgetary: strings[budgetary],
      budgetary_id: budgetaryId,
      plan: strings[plan],
      plan_prefix: strings[planPrefix],
      plan_suffix: strings[planSuffix],
      output: strings[output],
      project: strings[project],
      category: strings[category],
      category_levels: splitList(strings[categoryLevels]),
      description: strings[description],
      amount,
      pdf_name: strings[pdfName],
      page_url: strings[pageUrl] + (page ?? ""),
      total_fiscal_amount: totalFiscalAmount,
      fiscal_year_list: splitList(strings[fiscalYearList]),
    };
  }

  return items.map(unpack);
}
