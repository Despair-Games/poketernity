import type { AbAttrConstructorMap } from "#abilities/ab-attr-constructor-map";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import type { PokemonWaveData } from "#types/pokemon-types";

/** Union type of all referable ability attribute class names as strings */
export type AbAttrKey = keyof AbAttrConstructorMap;

/** @interface */
export type AbAttrMap = {
  [K in keyof AbAttrConstructorMap]: InstanceType<AbAttrConstructorMap[K]>;
};

/** @interface */
export type AbAttrParamMap = {
  [K in keyof AbAttrMap]: Parameters<AbAttrMap[K]["apply"]>[0];
};

export type AbAttrCondition = (pokemon: Pokemon) => boolean;
export type PreDefendAbAttrCondition = (pokemon: Pokemon, attacker: Pokemon, move: Move) => boolean;

export interface ApplyAbAttrsOptions {
  /** Whether to ignore ability override effects (e.g. Skill Swap) */
  bypassSummonData?: boolean;
  /**
   * Whether to filter out abilities that have not been revealed to the field yet
   * @see {@linkcode PokemonWaveData.abilitiesRevealed}
   */
  revealedOnly?: boolean;
  /** Whether to filter out abilities that are suppressed or ignored */
  canApplyOnly?: boolean;
  /**
   * Whether to apply the normal and/or passive abilities of the pokemon.
   * @remarks
   * If `undefined` both will be applied,
   * otherwise only the regular (`false`) or passive (`true`) ability will be applied.
   */
  // TODO: not yet implemented
  passive?: boolean | undefined;
}
