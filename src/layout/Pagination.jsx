import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

/**
 * Pagination — smart windowed pagination
 *
 * Props:
 *   page        — current page (1-based for most modules, 0-based for CashBank)
 *   totalPages  — total number of pages
 *   onPageChange(newPage) — callback
 *   zeroBased   — pass true for CashBank which uses 0-based pages
 *   totalItems  — optional: show "X records" label
 *   pageSize    — optional: used with totalItems
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
  zeroBased = false,
  totalItems,
  pageSize,
}) {
  if (!totalPages || totalPages <= 1) return null;

  // Normalise to 1-based internally
  const current = zeroBased ? page + 1 : page;
  const go = (p) => onPageChange(zeroBased ? p - 1 : p);

  // Build windowed page numbers  [ 1 … 4 5 [6] 7 8 … 20 ]
  function getPages() {
    const delta = 2;
    const pages = [];
    const left  = Math.max(2, current - delta);
    const right = Math.min(totalPages - 1, current + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }

  const pages = getPages();

  // Record range label
  let rangeLabel = null;
  if (totalItems !== undefined && pageSize) {
    const from = (current - 1) * pageSize + 1;
    const to   = Math.min(current * pageSize, totalItems);
    rangeLabel = `${from}–${to} of ${totalItems}`;
  }

  return (
    <div className="pg-bar">
      {/* Left: record range */}
      <span className="pg-info">
        {rangeLabel
          ? rangeLabel
          : `Page ${current} of ${totalPages}`}
      </span>

      {/* Controls */}
      <div className="pg-controls">
        {/* First */}
        <button
          className="pg-btn pg-btn--icon"
          disabled={current === 1}
          onClick={() => go(1)}
          title="First page"
          aria-label="First page"
        >
          <FaAngleDoubleLeft size={11} />
        </button>

        {/* Prev */}
        <button
          className="pg-btn pg-btn--icon"
          disabled={current === 1}
          onClick={() => go(current - 1)}
          title="Previous page"
          aria-label="Previous page"
        >
          <FaChevronLeft size={11} />
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="pg-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`pg-btn pg-btn--num ${p === current ? "pg-btn--active" : ""}`}
              onClick={() => go(p)}
              aria-label={`Page ${p}`}
              aria-current={p === current ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          className="pg-btn pg-btn--icon"
          disabled={current === totalPages}
          onClick={() => go(current + 1)}
          title="Next page"
          aria-label="Next page"
        >
          <FaChevronRight size={11} />
        </button>

        {/* Last */}
        <button
          className="pg-btn pg-btn--icon"
          disabled={current === totalPages}
          onClick={() => go(totalPages)}
          title="Last page"
          aria-label="Last page"
        >
          <FaAngleDoubleRight size={11} />
        </button>
      </div>
    </div>
  );
}
