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
  // by placing this block after the prettierConfig, disabled rules can be re-enabled for specific files
  {
    name: "eslint-special-files",
    files: ["src/**/init-moves.ts", "src/**/init-abilities.ts"],
    languageOptions: {
      parser: parser,
    },
    plugins: {
      "import-x": importX,
      "@stylistic": stylistic,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      indent: ["error", 2, { SwitchCase: 1 }], // Enforces a 2-space indentation, enforces indentation of `case ...:` statements
      "no-undef": "off", // Disables the rule that disallows the use of undeclared variables (TypeScript handles this)
      "eol-last": ["error", "always"], // Enforces at least one newline at the end of files
      "@stylistic/semi": ["error", "always"], // Requires semicolons for TypeScript-specific syntax
      semi: "off", // Disables the general semi rule for TypeScript files
      "no-extra-semi": "error", // Disallows unnecessary semicolons for TypeScript-specific syntax
      "brace-style": "off", // Note: you must disable the base rule as it can report incorrect errors
      curly: ["error", "all"], // Enforces the use of curly braces for all control statements
      "@stylistic/brace-style": ["error", "1tbs"], // Enforces the following brace style: https://eslint.style/rules/js/brace-style#_1tbs
      "no-trailing-spaces": [
        // Disallows trailing whitespace at the end of lines
        "error",
        {
          skipBlankLines: false, // Enforces the rule even on blank lines
          ignoreComments: false, // Enforces the rule on lines containing comments
        },
      ],
      "space-before-blocks": ["error", "always"], // Enforces a space before blocks
      "keyword-spacing": ["error", { before: true, after: true }], // Enforces spacing before and after keywords
      "comma-spacing": ["error", { before: false, after: true }], // Enforces spacing after commas
      "import-x/extensions": ["error", "never", { json: "always" }], // Enforces no extension for imports unless json
      "object-curly-spacing": ["error", "always", { arraysInObjects: false, objectsInObjects: false }], // Enforces consistent spacing inside braces of object literals, destructuring assignments, and import/export specifiers
      "computed-property-spacing": ["error", "never"], // Enforces consistent spacing inside computed property brackets
      "space-infix-ops": ["error", { int32Hint: false }], // Enforces spacing around infix operators
      "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 1, maxBOF: 0 }], // Disallows multiple empty lines
    },
  },
);
