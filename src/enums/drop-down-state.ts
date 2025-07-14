import type { EnumValues } from "#types/utility-types";

export const DropDownState = {
  ON: 1,
  OFF: 2,
  EXCLUDE: 3,
  UNLOCKABLE: 4,
  PARTIAL: 5,
} as const;

export type DropDownState = EnumValues<typeof DropDownState>;
