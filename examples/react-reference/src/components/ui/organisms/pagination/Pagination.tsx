import { clsx } from "clsx";

import { usePaginationItems } from "./Pagination.hooks";
import type { PaginationProps } from "./Pagination.interface";

import styles from "./pagination.module.css";

export const Pagination = (props: PaginationProps) => {
  const { className, onPageChange, page, pageSize, siblingCount = 1, total } = props;

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), pageCount);
  const items = usePaginationItems({ currentPage, pageCount, siblingCount });

  const handlePrevious = () => {
    onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    onPageChange(currentPage + 1);
  };

  if (pageCount === 1) {
    return null;
  }

  return (
    <nav aria-label="Страницы" className={clsx(styles.pagination, className)}>
      <button
        aria-label="Предыдущая страница"
        className="button button-size-sm button-variant-secondary"
        disabled={currentPage === 1}
        onClick={handlePrevious}
        type="button"
      >
        ←
      </button>

      {items.map((item) =>
        item.type === "ellipsis" ? (
          <span aria-hidden="true" className={styles.ellipsis} key={item.key}>
            …
          </span>
        ) : (
          <button
            aria-current={item.page === currentPage ? "page" : undefined}
            className={clsx(
              "button",
              "button-size-sm",
              item.page === currentPage ? "button-variant-primary" : "button-variant-secondary",
            )}
            key={item.page}
            onClick={() => onPageChange(item.page)}
            type="button"
          >
            {item.page}
          </button>
        ),
      )}

      <button
        aria-label="Следующая страница"
        className="button button-size-sm button-variant-secondary"
        disabled={currentPage === pageCount}
        onClick={handleNext}
        type="button"
      >
        →
      </button>
    </nav>
  );
};
