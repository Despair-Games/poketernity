import type { EnumValues } from "#types/enum-values";

export const DropDownType = {
  SINGLE: 1,
  MULTI: 2,
  HYBRID: 3,
  RADIAL: 4,
} as const;

export type DropDownType = EnumValues<typeof DropDownType>;
