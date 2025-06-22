// -- start tsdoc imports --
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { MoveAttr, MoveAttrOptions } from "#moves/move-attrs/move-attr";
import type { Pokemon } from "#field/pokemon";
/* eslint-enable @typescript-eslint/no-unused-vars */
// -- end tsdoc imports --

/** The {@link Pokemon.getAttackScore | Attack Score} granted to moves that KO an opponent. */
export const KO_ATTACK_SCORE = 4;

/**
 * The damage (in terms of % maximum HP) a projected attack must deal
 * to a target to reach the next scoring "tier". An attack projected to deal
 * damage below this threshold will receive an Attack Score of either 0 or 1.
 * On the other hand, attacks projected to deal damage above this threshold
 * will receive an Attack Score of either 1 or 2.
 * @see {@linkcode Pokemon.getAttackScore}
 * @see {@linkcode Pokemon.getExpectedAttackScore}
 */
export const ATTACK_SCORE_HP_THRESHOLD = 40;

/**
 * A relatively major bonus to a move attribute's {@link MoveAttr.getEffectScore | Effect Score}.
 * Used when a move with the attribute gains a decisive advantage in
 * a given battle state.
 */
export const MAJOR_EFFECT_SCORE_BONUS = 2;

/**
 * A relatively minor bonus to a move attribute's {@link MoveAttr.getEffectScore | Effect Score}.
 * Used when a move with the attribute gains a slight advantage in
 * a given battle state.
 */
export const MINOR_EFFECT_SCORE_BONUS = 1;

/**
 * A relatively major penalty to a move's score. Used when a move has
 * a significant drawback or is likely to fail from an unresolvable condition
 * in a given battle state.
 */
export const MAJOR_EFFECT_SCORE_PENALTY = -MAJOR_EFFECT_SCORE_BONUS;

/**
 * A relatively minor penalty to a move's score. Used when a move has
 * a potential drawback or has a chance of failing from an unresolvable condition
 * in a given battle state.
 */
export const MINOR_EFFECT_SCORE_PENALTY = -MINOR_EFFECT_SCORE_BONUS;

/**
 * A weakly enforced upper limit for move attributes' {@link MoveAttr.getEffectScore | Effect Scores}.
 * Attributes generally shouldn't give enough of a bonus to supersede
 * attacks that can KO opponents.
 */
export const SOFT_EFFECT_SCORE_LIMIT = KO_ATTACK_SCORE - 1;

/**
 * The score penalty granted to moves that effectively do nothing, e.g.
 * - Attacking into an opponent with a known immunity via typing, Ability, etc.
 * - Using a move that is known to fail before selection.
 * - Using Skill Swap on an enemy with a bad ability (e.g. Truant)
 */
export const BAD_MOVE_PENALTY = -5;

/**
 * The score penalty granted by default when targeting an ally in a double battle.
 * This should prevent the AI from deciding to attack their ally, for example.
 * Certain move attributes may {@link MoveAttrOptions.overridesAllyTargetPenalty | override this penalty}.
 */
export const ALLY_TARGET_PENALTY = -20;

/**
 * The score penalty granted when targeting a Pokemon that is {@link https://bulbapedia.bulbagarden.net/wiki/Commander_(Ability) | Commanding}
 * its ally. The AI should always expect this move to miss.
 */
export const COMMANDING_TARGET_PENALTY = -20;

/**
 * A {@link Pokemon.getMatchupScore | Matchup Score} value indicating a
 * Pokemon is strongly favored against its opponent
 */
export const STRONG_MATCHUP_SCORE_THRESHOLD = 4;

/**
 * A {@link Pokemon.getMatchupScore | Matchup Score} value indicating a
 * Pokemon is favored against its opponent
 */
export const FAVORABLE_MATCHUP_SCORE_THRESHOLD = 3;
