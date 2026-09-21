import { clsx } from "clsx";
import { useId } from "react";

import type { TextFieldProps } from "./TextField.interface";

import styles from "./textField.module.css";

export const TextField = (props: TextFieldProps) => {
  const { className, error, hint, id, label, ...inputProps } = props;

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = `${inputId}-description`;
  const description = error || hint;

  return (
    <div className={styles.field}>
      <label className="label" htmlFor={inputId}>
        {label}
      </label>

      <input
        {...inputProps}
        aria-describedby={description ? descriptionId : undefined}
        aria-invalid={Boolean(error)}
        className={clsx("input", className)}
        id={inputId}
      />

      {description && (
        <p className={error ? styles.error : styles.hint} id={descriptionId}>
          {description}
        </p>
      )}
    </div>
  );
};
