import { ConnectionPage } from "@/pages";

import { RootProvider } from "./RootProvider";

export const App = () => (
  <RootProvider>
    <ConnectionPage />
  </RootProvider>
);
