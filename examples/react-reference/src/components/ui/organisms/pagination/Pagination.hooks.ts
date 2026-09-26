import { useMemo } from "react";

import type { PaginationItem, UsePaginationItemsProps } from "./Pagination.interface";

/** Окно номеров: первая и последняя страницы, соседи текущей и многоточия между разрывами. */
export const usePaginationItems = (props: UsePaginationItemsProps): PaginationItem[] => {
  const { currentPage, pageCount, siblingCount } = props;

  return useMemo(() => {
    const start = Math.max(1, currentPage - siblingCount);
    const end = Math.min(pageCount, currentPage + siblingCount);
    const pages = new Set([1, pageCount]);

    for (let page = start; page <= end; page += 1) {
      pages.add(page);
    }

    const sorted = Array.from(pages).sort((a, b) => a - b);
    const items: PaginationItem[] = [];

    sorted.forEach((page, index) => {
      const previous = sorted[index - 1];

      if (previous !== undefined && page - previous > 1) {
        items.push({ key: `ellipsis-${previous}`, type: "ellipsis" });
      }

      items.push({ page, type: "page" });
    });

    return items;
  }, [currentPage, pageCount, siblingCount]);
};
