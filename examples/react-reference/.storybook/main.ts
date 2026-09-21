import type { StorybookConfig } from "@storybook/react-vite";

const Config = {
  addons: ["@storybook/addon-docs"],
  core: { disableTelemetry: true },
  framework: "@storybook/react-vite",
  stories: ["../src/components/ui/**/*.stories.tsx"],
} satisfies StorybookConfig;

export default Config;
