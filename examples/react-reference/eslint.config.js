import stylistic from "@stylistic/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["src/lib/utils/**/*.ts", "src/pages/**/utils/**/*.ts"],
    rules: { "arrow-body-style": ["error", "always"] },
  },
  { ignores: ["node_modules/**", "dist/**", "storybook-static/**", "demo/public/**"] },
  {
    files: ["**/*.{ts,tsx,js}"],
    languageOptions: { parser: tseslint.parser },
    plugins: { "@stylistic": stylistic, "react-hooks": reactHooks },
    rules: {
      "@stylistic/no-multiple-empty-lines": ["error", { max: 1 }],
      "@stylistic/padding-line-between-statements": [
        "error",
        { blankLine: "always", next: "*", prev: ["const", "let"] },
        { blankLine: "any", next: ["const", "let"], prev: ["const", "let"] },
        { blankLine: "always", next: "return", prev: "*" },
        {
          blankLine: "always",
          next: "*",
          prev: {
            selector:
              "VariableDeclaration:has(VariableDeclarator > ObjectPattern.id), VariableDeclaration:has(VariableDeclarator > ArrayPattern.id)",
          },
        },
      ],
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/rules-of-hooks": "error",
    },
  },
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/services",
                "@/services/**",
                "@/store",
                "@/store/**",
                "@/app",
                "@/app/**",
                "@/components/business",
                "@/components/business/**",
                "**/services",
                "**/services/**",
                "**/store",
                "**/store/**",
                "**/app",
                "**/app/**",
                "@/pages",
                "@/pages/**",
                "**/pages",
                "**/pages/**",
                "@/routes",
                "@/routes/**",
                "**/routes",
                "**/routes/**",
                "**/business",
                "**/business/**",
              ],
              message: "UI не зависит от сервисов, состояния приложения или бизнес-сценариев.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/services/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/app",
                "@/app/**",
                "@/components",
                "@/components/**",
                "@/store",
                "@/store/**",
                "**/app",
                "**/app/**",
                "@/pages",
                "@/pages/**",
                "**/pages",
                "**/pages/**",
                "@/routes",
                "@/routes/**",
                "**/routes",
                "**/routes/**",
                "**/components",
                "**/components/**",
                "**/store",
                "**/store/**",
              ],
              message: "Services не зависят от app, components и store.",
            },
          ],
        },
      ],
    },
  },
];
