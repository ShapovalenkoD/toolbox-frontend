import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

const StoryMeta = {
  args: { "aria-label": "Название", placeholder: "Название пространства" },
  render: (args) => <input {...args} className="input" />,
  tags: ["autodocs"],
  title: "UI/Atoms/Input",
} satisfies Meta<ComponentProps<"input">>;

export default StoryMeta;

export const Default: StoryObj<typeof StoryMeta> = {};

export const Disabled: StoryObj<typeof StoryMeta> = {
  args: { defaultValue: "Моя команда", disabled: true },
};

export const Invalid: StoryObj<typeof StoryMeta> = {
  args: { "aria-invalid": true, defaultValue: "?" },
};
