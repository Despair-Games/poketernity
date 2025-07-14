import type { EnumValues } from "#types/utility-types";

/** @todo make this start at 1 */
export const AnimBlendType = {
  NORMAL: 0,
  ADD: 1,
  SUBTRACT: 2,
} as const;

export type AnimBlendType = EnumValues<typeof AnimBlendType>;
