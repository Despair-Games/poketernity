import type { EnumValues } from "#types/utility-types";

export const MoveCategory = {
  STATUS: 1,
  PHYSICAL: 2,
  SPECIAL: 3,
} as const;

export type MoveCategory = EnumValues<typeof MoveCategory>;
