import type { EnumValues } from "#types/utility-types";

export const MoveResult = {
  PENDING: 1,
  SUCCESS: 2,
  FAIL: 3,
  MISS: 4,
  OTHER: 5,
} as const;

export type MoveResult = EnumValues<typeof MoveResult>;
