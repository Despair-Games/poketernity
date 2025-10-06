import type { EnumValues } from "#types/utility-types";

export const TransformationScreenPosition = {
  CENTER: 1,
  LEFT: 2,
  RIGHT: 3,
} as const;

export type TransformationScreenPosition = EnumValues<typeof TransformationScreenPosition>;
