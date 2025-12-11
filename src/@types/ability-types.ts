import type { AbAttrConstructorMap } from "#abilities/ab-attr-constructor-map";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonWaveData } from "#types/pokemon-types";

/** Union type of all referable ability attribute class names as strings */
export type AbAttrKey = keyof AbAttrConstructorMap;

export type AbAttrMap = {
  [K in keyof AbAttrConstructorMap]: InstanceType<AbAttrConstructorMap[K]>;
};

export type AbAttrParamMap = {
  [K in keyof AbAttrMap]: Parameters<AbAttrMap[K]["apply"]>;
};

export type AbAttrCondition = (pokemon: Pokemon) => boolean;
export type PreDefendAbAttrCondition = (pokemon: Pokemon, attacker: Pokemon, move: Move) => boolean;

export interface AbilityFilterOptions {
  /**
   * If `true`, returns the Pokemon's base Ability whether or
   * not it was overridden in battle (e.g. by Skill Swap or Entrainment)
   */
  bypassSummonData?: boolean;
  /**
   * If `true`, filters out Abilities that have not been revealed to the field yet
   * @see {@linkcode PokemonWaveData.abilitiesRevealed}
   */
  revealedOnly?: boolean;
  /** If `true`, filters out Abilities that are suppressed or ignored */
  canApplyOnly?: boolean;
}
