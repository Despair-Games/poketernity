// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { LoadingScene } from "#app/loading-scene";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

export type LanguageEvent = "language/change";

export type SupportedLanguageKey = "en" | "es-ES" | "it" | "fr" | "de" | "pt-BR" | "zh-CN" | "zh-TW" | "ko" | "ja";

export type SupportedLanguage = {
  label: string;
  key: SupportedLanguageKey;
  /**
   * Whether all localized images are available for the language, ie: status and types icons.
   * To find all localized images, check {@linkcode LoadingScene} for loadXXXX calls that have a `languageKey` parameter.
   */
  hasAllLocalizedImages: boolean;
};
