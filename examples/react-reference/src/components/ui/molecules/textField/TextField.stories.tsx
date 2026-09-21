import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextField } from "./TextField";

const StoryMeta = {
  args: { label: "Название пространства", placeholder: "Моя команда" },
  component: TextField,
  tags: ["autodocs"],
  title: "UI/Molecules/TextField",
} satisfies Meta<typeof TextField>;

export default StoryMeta;

export const Default: StoryObj<typeof StoryMeta> = {};

export const WithHint: StoryObj<typeof StoryMeta> = {
  args: { hint: "Это название будет видно вашей команде." },
};

export const WithError: StoryObj<typeof StoryMeta> = {
  args: { error: "Введите хотя бы два символа." },
};

export const Disabled: StoryObj<typeof StoryMeta> = {
  args: { defaultValue: "Моя команда", disabled: true },
};
