import type { ObjectValues } from "#types/utility-types";

export const DropDownType = {
  SINGLE: 1,
  MULTI: 2,
  HYBRID: 3,
  RADIAL: 4,
} as const;

export type DropDownType = ObjectValues<typeof DropDownType>;
