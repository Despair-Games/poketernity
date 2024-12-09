import tseslint from "@typescript-eslint/eslint-plugin";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import parser from "@typescript-eslint/parser";
import importX from "eslint-plugin-import-x";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    ignores: ["dist/*", "build/*", "coverage/*", "public/*", ".github/*", "node_modules/*", ".vscode/*"],
    languageOptions: {
      parser: parser,
    },
    plugins: {
      "import-x": importX,
      "@stylistic/ts": stylisticTs,
      "@typescript-eslint": tseslint,
    },
    rules: {
      eqeqeq: ["error", "always"], // Enforces the use of `===` and `!==` instead of `==` and `!=`
      indent: ["error", 2, { SwitchCase: 1 }], // Enforces a 2-space indentation, enforces indentation of `case ...:` statements
      quotes: ["error", "double"], // Enforces the use of double quotes for strings
      "no-var": "error", // Disallows the use of `var`, enforcing `let` or `const` instead
      "prefer-const": "error", // Enforces the use of `const` for variables that are never reassigned
      "no-undef": "off", // Disables the rule that disallows the use of undeclared variables (TypeScript handles this)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all", // Disallows unused variables
          ignoreRestSiblings: true, // Allows unused variables that are part of a rest property in object destructuring. Useful for excluding certain properties from an object while using the others.
          argsIgnorePattern: "^_", // Allows unused variables that start with an underscore
        },
      ],
      "eol-last": ["error", "always"], // Enforces at least one newline at the end of files
      "@stylistic/ts/semi": ["error", "always"], // Requires semicolons for TypeScript-specific syntax
      semi: "off", // Disables the general semi rule for TypeScript files
      "no-extra-semi": ["error"], // Disallows unnecessary semicolons for TypeScript-specific syntax
      "brace-style": "off", // Note: you must disable the base rule as it can report incorrect errors
      curly: ["error", "all"], // Enforces the use of curly braces for all control statements
      "@stylistic/ts/brace-style": ["error", "1tbs"], // Enforces the following brace style: https://eslint.style/rules/js/brace-style#_1tbs
      "no-trailing-spaces": [
        "error",
        {
          // Disallows trailing whitespace at the end of lines
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
      "@typescript-eslint/consistent-type-imports": "error", // Enforces type-only imports wherever possible
      "@typescript-eslint/explicit-function-return-type": "warn", // Warns if a function doesn't have a specified return type
      "@typescript-eslint/explicit-member-accessibility": [
        "warn", // Warns if a class member doesn't have defined accessibility (`public`/etc)
        {
          overrides: {
            constructors: "off", // Doesn't warn for class constructors
          },
        },
      ],
    },
  },
  prettierConfig,
];
