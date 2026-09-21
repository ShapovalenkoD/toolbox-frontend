import type { ComponentPropsWithRef } from "react";

export interface TextFieldProps extends ComponentPropsWithRef<"input"> {
  label: string;
  error?: string;
  hint?: string;
}
