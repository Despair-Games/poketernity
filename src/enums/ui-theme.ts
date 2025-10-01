import type { EnumValues } from "#types/utility-types";

export const UiTheme = {
  DARK: 1,
  LIGHT: 2,
} as const;

export type UiTheme = EnumValues<typeof UiTheme>;
