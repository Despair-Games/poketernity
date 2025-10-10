import type { ObjectValues } from "#types/utility-types";

export const TransformationScreenPosition = {
  CENTER: 1,
  LEFT: 2,
  RIGHT: 3,
} as const;

export type TransformationScreenPosition = ObjectValues<typeof TransformationScreenPosition>;
