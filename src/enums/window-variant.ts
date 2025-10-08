import type { ObjectValues } from "#types/utility-types";

export const WindowVariant = {
  NORMAL: 1,
  THIN: 2,
  XTHIN: 3,
} as const;

export type WindowVariant = ObjectValues<typeof WindowVariant>;
