import { clsx } from "clsx";

import type { LoadingButtonProps } from "./LoadingButton.interface";

import styles from "./loadingButton.module.css";

export const LoadingButton = (props: LoadingButtonProps) => {
  const { children, className, disabled, loading = false, type = "button", ...buttonProps } = props;

  return (
    <button
      {...buttonProps}
      aria-busy={loading}
      className={clsx("button", "button-size-md", "button-variant-primary", className)}
      disabled={disabled || loading}
      type={type}
    >
      {loading && <span aria-hidden="true" className={styles.spinner} />}
      {children}
    </button>
  );
};
