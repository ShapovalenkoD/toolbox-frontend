import type { Preview } from "@storybook/react-vite";

import "../src/components/ui/index.css";

const PreviewConfig = {
  parameters: {
    layout: "padded",
    options: {
      storySort: { order: ["UI", ["Atoms", "Molecules"]] },
    },
  },
} satisfies Preview;

export default PreviewConfig;
