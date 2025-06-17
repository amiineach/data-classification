import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Disable all rules for generated files
  {
    files: ["src/generated/**/*.{js,ts,jsx,tsx}"],
    rules: {
      // Disables all checks by turning off every rule
      all: "off",
    },
  },
];

export default eslintConfig;
