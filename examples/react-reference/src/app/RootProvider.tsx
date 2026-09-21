import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import type { RootProviderProps } from "./RootProvider.interface";

export const RootProvider = (props: RootProviderProps) => {
  const { children } = props;

  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { mutations: { retry: false } } }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
