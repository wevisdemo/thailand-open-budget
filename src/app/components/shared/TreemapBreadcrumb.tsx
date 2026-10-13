import type { TreemapNode } from "@/types/treemap";
import { getTreemapNode } from "@/constants/treemap";

interface TreemapBreadcrumbProps {
  tree: TreemapNode;
  // The level shown.
  node: TreemapNode;
  onSelect: (step: TreemapNode) => void;
}

// The levels from the top down to the one shown, e.g. "แผนงานทั้งหมด /
// แผนงานบูรณาการ"; each level above it goes back there. While the shown
// level's groups have groups of their own, a hint says they can be clicked.
export default function TreemapBreadcrumb({
  tree,
  node,
  onSelect,
}: TreemapBreadcrumbProps) {
  const steps = [
    tree,
    ...node.path.map(
      (_, i) => getTreemapNode(tree, node.path.slice(0, i + 1))!,
    ),
  ];
  const canDrill = node.children.some((child) => child.children.length > 0);

  return (
    <nav aria-label="ระดับที่แสดง">
      <ol className="flex flex-wrap items-center gap-x-[8px] text-[14px]">
        {steps.map((step, i) => (
          <li key={step.path.length} className="flex items-center gap-[8px]">
            {i > 0 && <span aria-hidden>/</span>}
            {i < steps.length - 1 ? (
              <button
                type="button"
                onClick={() => onSelect(step)}
                className="text-link-01 cursor-pointer"
              >
                {step.name}
              </button>
            ) : (
              <span
                aria-current="location"
                className={i === 0 ? "text-link-01" : "text-text-01"}
              >
                {step.name}
              </span>
            )}
          </li>
        ))}
        {canDrill && (
          <li className="text-text-02 flex items-center gap-[8px]">
            <span aria-hidden>/</span>
            <span aria-hidden>•</span>
            คลิกเพื่อดูอีก 1 ระดับ
          </li>
        )}
      </ol>
    </nav>
  );
}
