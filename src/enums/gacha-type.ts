import type { EnumValues } from "#types/utility-types";

export const GachaType = {
  MOVE: 1,
  LEGENDARY: 2,
  SHINY: 3,
} as const;

export type GachaType = EnumValues<typeof GachaType>;
