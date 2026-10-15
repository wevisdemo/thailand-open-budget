import type { TreemapNode } from "@/types/treemap";
import { getTreemapDepth, getTreemapNode } from "@/constants/treemap";

interface TreemapBreadcrumbProps {
  tree: TreemapNode;
  // The level shown.
  node: TreemapNode;
  onSelect: (step: TreemapNode) => void;
}

// The levels from the top down to the one shown, e.g. "แผนงานทั้งหมด /
// แผนงานบูรณาการ"; each level above it goes back there. While the shown
// level's groups have groups of their own, a hint says how many levels down
// a click can still go.
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
  // The levels a click can still go down: the shown tiles are one level
  // below the node, so a node reaching LV6 from LV1 tiles leaves 5.
  const levelsLeft = getTreemapDepth(node) - 1;

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
        {levelsLeft > 0 && (
          <li className="text-text-02 flex items-center gap-[8px]">
            <span aria-hidden>/</span>
            <span aria-hidden>•</span>
            คลิกเพื่อดูอีก {levelsLeft} ระดับ
          </li>
        )}
      </ol>
    </nav>
  );
}
