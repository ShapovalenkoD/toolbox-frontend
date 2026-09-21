import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

const StoryMeta = {
  args: { children: "Продолжить", type: "button" },
  render: (args) => <button {...args} className="button button-size-md button-variant-primary" />,
  tags: ["autodocs"],
  title: "UI/Atoms/Button",
} satisfies Meta<ComponentProps<"button">>;

export default StoryMeta;

export const Default: StoryObj<typeof StoryMeta> = {};

export const Disabled: StoryObj<typeof StoryMeta> = {
  args: { disabled: true },
};

export const AsLink: StoryObj<typeof StoryMeta> = {
  render: () => (
    <a className="button button-size-md button-variant-primary" href="#example">
      Перейти к примеру
    </a>
  ),
};

export const Large: StoryObj<typeof StoryMeta> = {
  render: (args) => <button {...args} className="button button-size-lg button-variant-primary" />,
};
