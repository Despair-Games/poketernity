/*
 * SPDX-FileCopyrightText: 2025 Pagefault Games
 * SPDX-FileCopyrightText: 2026 Despair Games
 * SPDX-FileContributor: Bertie690
 * SPDX-FileContributor: NightKev
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/// <reference path="./global.d.ts" />

const dryRun = process.env.DRY_RUN === "true";
const currentYear = new Date().getFullYear();

/**
 * <!-- @satisfies {Partial<import("typedoc").TypeDocOptions>} -->
 */
const config = {
  entryPoints: ["./src", "./test/test-utils"],
  entryPointStrategy: "expand",
  exclude: [
    "src/polyfills.ts",
    "src/phaser-extensions.ts",
    "src/vite.env.d.ts",
    "**/*+.test.ts",
    "**/*+.test-d.ts",
    "test/test-utils/setup",
    "test/test-utils/reporters",
    "test/@types/matcher-helpers.ts",
    "test/@types/vitest.d.ts",
  ],
  excludePrivate: false, // Private members are useful in the docs for contributors
  excludeReferences: true, // prevent documenting re-exports
  requiredToBeDocumented: [
    "Enum",
    "EnumMember",
    "Variable",
    "Function",
    "Class",
    "Interface",
    "Property",
    "Method",
    "Accessor",
    "TypeAlias",
  ],
  highlightLanguages: ["javascript", "json", "jsonc", "json5", "tsx", "typescript", "markdown"],
  plugin: ["typedoc-github-theme", "typedoc-plugin-mdn-links", "typedoc-plugin-missing-exports"],
  // Avoid emitting docs for branches other than main/beta
  emit: dryRun ? "none" : "docs",
  out: process.env.CI ? "/tmp/docs" : "./typedoc",
  name: "Pokéternity",
  readme: "./README.md",
  projectDocuments: ["docs/*.md"],
  favicon: "./favicon.ico",
  theme: "typedoc-github-theme",
  customFooterHtml: `<p>Copyright <strong>Despair Games</strong> ${currentYear === 2026 ? "2026" : "2026 - " + currentYear}</p>`,
  customFooterHtmlDisableWrapper: true,
  navigationLinks: {
    GitHub: "https://github.com/despair-games/poketernity",
  },
  includeDocCommentReferences: true,
  placeInternalsInOwningModule: true,
};

// If generating docs for main/beta, check the ref name and add an appropriate navigation header
//! Note: disabled while there is no `main` branch
/*
if (!dryRun && process.env.REF_NAME) {
  const otherRefName = process.env.REF_NAME === "main" ? "beta" : "main";
  config.navigationLinks = {
    ...config.navigationLinks,
    // This will be "Switch to Beta" when on main, and vice versa
    [`Switch to ${otherRefName.charAt(0).toUpperCase() + otherRefName.slice(1).toLowerCase()}`]: `https://despair-games.github.io/poketernity/${otherRefName}`,
  };
}
*/

// biome-ignore lint/style/noDefaultExport: required by TypeDoc
export default config;
