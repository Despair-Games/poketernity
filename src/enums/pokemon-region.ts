import type { ObjectValues } from "#types/utility-types";

export const PokemonRegion = {
  NORMAL: 1,
  ALOLA: 2,
  GALAR: 3,
  HISUI: 4,
  PALDEA: 5,
} as const;

export type PokemonRegion = ObjectValues<typeof PokemonRegion>;
