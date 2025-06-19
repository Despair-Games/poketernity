import type { EnumValues } from "#types/enum-values";

export const DropDownColumn = {
  GEN: 1,
  TYPES: 2,
  CAUGHT: 3,
  UNLOCKS: 4,
  MISC: 5,
  SORT: 6,
} as const;

export type DropDownColumn = EnumValues<typeof DropDownColumn>;
