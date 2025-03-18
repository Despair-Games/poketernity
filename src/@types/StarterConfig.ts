import type PokemonSpecies from "#app/data/pokemon-species";
import type { Nature } from "#enums/nature";
import type { StarterMoveset } from "#app/@types/StarterData";

export interface StarterConfig {
  species: PokemonSpecies;
  dexAttr: bigint;
  abilityIndex: number;
  passive: boolean;
  nature: Nature;
  moveset?: StarterMoveset;
  pokerus: boolean;
  nickname?: string;
}
