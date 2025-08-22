// @ts-check
import stylistic from "@stylistic/eslint-plugin";
import parser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import importX from "eslint-plugin-import-x";
import noRelativeImportPaths from "eslint-plugin-no-relative-import-paths";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    name: "eslint-config",
    files: ["src/**/*.{ts,tsx,js,jsx}", "test/**/*.{ts,tsx,js,jsx}"],
    ignores: ["dist/*", "build/*", "coverage/*", "public/*", ".github/*", "node_modules/*", ".vscode/*"],
    languageOptions: {
      parser: parser,
    },
    plugins: {
      "import-x": importX,
      "@stylistic": stylistic,
      "@typescript-eslint": tseslint.plugin,
      "no-relative-import-paths": noRelativeImportPaths,
    },
    rules: {
      "no-undef": "off", // Disables the rule that disallows the use of undeclared variables (TypeScript handles this)
      "@stylistic/semi": ["error", "always"], // Requires semicolons for TypeScript-specific syntax
      semi: "off", // Disables the general semi rule for TypeScript files
      "no-extra-semi": "error", // Disallows unnecessary semicolons for TypeScript-specific syntax
      "import-x/extensions": ["error", "never", { json: "always" }], // Enforces no extension for imports unless json
      "no-relative-import-paths/no-relative-import-paths": [
        // Enforces absolute paths only (for example, converts "./data/moves/move-attrs/call-move-attr" to "#app/data/moves/move-attrs/call-move-attr")
        "error",
        { rootDir: "src", prefix: "#app" },
      ],
    },
  },
  {
    name: "eslint-tests",
    files: ["test/**/**.test.ts"],
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error", // Require Promise-like statements to be handled appropriately. - https://typescript-eslint.io/rules/no-floating-promises/
      "@typescript-eslint/no-misused-promises": "error", // Disallow Promises in places not designed to handle them. - https://typescript-eslint.io/rules/no-misused-promises/
    },
  },
  prettierConfig,
);
