import type { EnumValues } from "#types/utility-types";

export const Unlockables = {
  ENDLESS_MODE: 1,
  MINI_BLACK_HOLE: 2,
  EVIOLITE: 3,
} as const;

export type Unlockables = EnumValues<typeof Unlockables>;
