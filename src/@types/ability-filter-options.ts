// -- start tsdoc imports --
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { PokemonBattleData } from "#app/field/pokemon";
// -- end tsdoc imports --

export interface AbilityFilterOptions {
  /**
   * If `true`, returns the Pokemon's base Ability whether or
   * not it was overridden in battle (e.g. by Skill Swap or Entrainment)
   */
  baseOnly?: boolean;
  /**
   * If `true`, filters out Abilities that have not been revealed
   * to the field yet
   * @see {@linkcode PokemonBattleData.abilitiesRevealed}
   */
  revealedOnly?: boolean;
  /** If `true`, filters out Abilities that are suppressed or ignored */
  canApplyOnly?: boolean;
}
