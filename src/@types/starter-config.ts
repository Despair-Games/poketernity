import type { StarterMoveset } from "#app/@types/starter-data";
import type PokemonSpecies from "#data/pokemon-species";
import type { ElementalType } from "#enums/elemental-type";
import type { Nature } from "#enums/nature";

export interface StarterConfig {
  species: PokemonSpecies;
  dexAttr: bigint;
  abilityIndex: number;
  passive: boolean;
  nature: Nature;
  moveset?: StarterMoveset;
  pokerus: boolean;
  nickname?: string;
  teraType?: ElementalType;
}
