/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { Challenge } from "#data/challenge";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { EnumValues } from "#types/utility-types";

/**
 * An enum for all the challenge types. The parameter entries on these describe the
 * parameters to use when calling the applyChallenges function.
 */
export const ChallengeType = {
  /**
   * Challenges which modify what starters you can choose
   * @see {@linkcode Challenge.applyStarterChoice}
   */
  STARTER_CHOICE: 1,
  /**
   * Challenges which modify how many starter points you have
   * @see {@linkcode Challenge.applyStarterPoints}
   */
  STARTER_POINTS: 2,
  /**
   * Challenges which modify how many starter points you have
   * @see {@linkcode Challenge.applyStarterPointCost}
   */
  STARTER_COST: 3,
  /**
   * Challenges which modify your starters in some way
   * @see {@linkcode Challenge.applyStarterModify}
   */
  STARTER_MODIFY: 4,
  /**
   * Challenges which limit which pokemon you can have in battle.
   * @see {@linkcode Challenge.applyPokemonInBattle}
   */
  POKEMON_IN_BATTLE: 5,
  /**
   * Adds or modifies the fixed battles in a run
   * @see {@linkcode Challenge.applyFixedBattle}
   */
  FIXED_BATTLES: 6,
  /**
   * Modifies the effectiveness of Type matchups in battle
   * @see {@linkcode Challenge.applyTypeEffectiveness}
   */
  TYPE_EFFECTIVENESS: 7,
  /**
   * Modifies what level the AI pokemon are. UNIMPLEMENTED.
   */
  AI_LEVEL: 8,
  /**
   * Modifies how many move slots the AI has. UNIMPLEMENTED.
   */
  AI_MOVE_SLOTS: 9,
  /**
   * Modifies if a pokemon has its passive. UNIMPLEMENTED.
   */
  PASSIVE_ACCESS: 10,
  /**
   * Modifies the game mode settings in some way. UNIMPLEMENTED.
   */
  GAME_MODE_MODIFY: 11,
  /**
   * Modifies what level AI pokemon can access a move. UNIMPLEMENTED.
   */
  MOVE_ACCESS: 12,
  /**
   * Modifies what weight AI pokemon have when generating movesets. UNIMPLEMENTED.
   */
  MOVE_WEIGHT: 13,
} as const;

export type ChallengeType = EnumValues<typeof ChallengeType>;
