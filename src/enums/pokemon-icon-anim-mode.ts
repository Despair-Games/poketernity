import type { ObjectValues } from "#types/utility-types";

export const PokemonIconAnimMode = {
  NONE: 0,
  PASSIVE: 1,
  ACTIVE: 2,
} as const;

export type PokemonIconAnimMode = ObjectValues<typeof PokemonIconAnimMode>;
