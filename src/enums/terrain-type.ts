import type { EnumValues } from "#types/utility-types";

export const TerrainType = {
  NONE: 0,
  MISTY: 1,
  ELECTRIC: 2,
  GRASSY: 3,
  PSYCHIC: 4,
} as const;

export type TerrainType = EnumValues<typeof TerrainType>;
