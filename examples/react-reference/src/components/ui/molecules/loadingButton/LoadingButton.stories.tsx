import type { Meta, StoryObj } from "@storybook/react-vite";

import { LoadingButton } from "./LoadingButton";

const StoryMeta = {
  args: { children: "Подключиться", loading: false },
  component: LoadingButton,
  tags: ["autodocs"],
  title: "UI/Molecules/LoadingButton",
} satisfies Meta<typeof LoadingButton>;

export default StoryMeta;

export const Default: StoryObj<typeof StoryMeta> = {};

export const Loading: StoryObj<typeof StoryMeta> = {
  args: { loading: true },
};

export const Disabled: StoryObj<typeof StoryMeta> = {
  args: { disabled: true },
};
