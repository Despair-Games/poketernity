import type { ObjectValues } from "#types/utility-types";

export const UiTheme = {
  DARK: 1,
  LIGHT: 2,
} as const;

export type UiTheme = ObjectValues<typeof UiTheme>;
