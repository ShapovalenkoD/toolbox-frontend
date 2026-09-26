import type { ReactNode } from "react";

export interface PageLayoutProps {
  actions?: ReactNode;
  children: ReactNode;
  description?: ReactNode;
  title: string;
}
