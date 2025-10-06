import type { EnumValues } from "#types/utility-types";

export const WindowVariant = {
  NORMAL: 1,
  THIN: 2,
  XTHIN: 3,
} as const;

export type WindowVariant = EnumValues<typeof WindowVariant>;
