const ELLIPSIS = "ellipsis" as const;
export type PaginationRangeItem = number | typeof ELLIPSIS;

/**
 * Computes which page numbers to render around the current page, collapsing
 * the rest into ellipses — the standard "1 … 4 5 [6] 7 8 … 20" pattern.
 * Pure function so it's trivially unit-testable independent of the component.
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationRangeItem[] {
  const totalVisible = siblingCount * 2 + 5; // first + last + current + 2 ellipses

  if (totalPages <= totalVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
    return [...leftRange, ELLIPSIS, totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => totalPages - (3 + siblingCount * 2) + i + 1,
    );
    return [1, ELLIPSIS, ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i,
  );
  return [1, ELLIPSIS, ...middleRange, ELLIPSIS, totalPages];
}
