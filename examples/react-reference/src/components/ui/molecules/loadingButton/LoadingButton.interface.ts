import type { ComponentPropsWithRef } from "react";

export interface LoadingButtonProps extends ComponentPropsWithRef<"button"> {
  loading?: boolean;
}
