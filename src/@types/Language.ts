export type LanguageEvent = "language/change";

export type SupportedLanguageKey = "en" | "es-ES" | "it" | "fr" | "de" | "pt-BR" | "zh-CN" | "zh-TW" | "ko" | "ja";

export type SupportedLanguage = {
  label: string;
  key: SupportedLanguageKey;
};
