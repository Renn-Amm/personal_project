import jseslint from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.ts"],
    extends: [jseslint.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
])
