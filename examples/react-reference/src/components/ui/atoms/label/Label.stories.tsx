import type { Meta, StoryObj } from "@storybook/react-vite";

const StoryMeta = {
  render: () => (
    <div style={{ display: "grid", gap: 8 }}>
      <label className="label" htmlFor="label-example">
        Название пространства
      </label>
      <input id="label-example" />
    </div>
  ),
  tags: ["autodocs"],
  title: "UI/Atoms/Label",
} satisfies Meta;

export default StoryMeta;

export const Default: StoryObj<typeof StoryMeta> = {};
