import type { ObjectValues } from "#types/utility-types";

export const FieldPosition = {
  CENTER: 1,
  LEFT: 2,
  RIGHT: 3,
} as const;

export type FieldPosition = ObjectValues<typeof FieldPosition>;
