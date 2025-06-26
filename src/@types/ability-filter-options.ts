/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { PokemonWaveData } from "#types/pokemon-wave-data";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

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
