/** @todo make this start at 1 */
export const AnimBlendType = {
  NORMAL: 0,
  ADD: 1,
  SUBTRACT: 2,
} as const;

export type AnimBlendType = (typeof AnimBlendType)[keyof typeof AnimBlendType];
