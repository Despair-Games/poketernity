import { MINOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { getTypeDamageMultiplier } from "#data/type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";
import { clamp } from "#utils/common-utils";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Roost_(move) | Roost's}
 * type-removing effect. Removes Flying type from the user for the rest of the turn
 * @extends AddBattlerTagAttr
 */
export class RoostAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.ROOSTED, true);
  }

  /**
   * Grants a bonus or penalty depending on whether the user would benefit defensively
   * from losing its Flying type:
   * - Each opponent is evaluated by their most effective move against Flying, then assigned
   * an individual score based on that move's effectiveness.
   * - Opponents' scores are added together, then clamped between {@linkcode MINOR_EFFECT_SCORE_PENALTY}
   * and {@linkcode MINOR_EFFECT_SCORE_BONUS} for the final score.
   * @see {@linkcode getOpponentScore}
   */
  public override getRawEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    // If the user cannot change its type from this effect, no bonus or penalty applies
    if (user.isTerastallized || !user.isOfType(ElementalType.FLYING)) {
      return 0;
    }

    const rawScore = user
      .getOpponents()
      .map((opp) => this.getOpponentScore(opp))
      .reduce((total, score) => total + score, 0);

    return clamp(rawScore, MINOR_EFFECT_SCORE_PENALTY, MINOR_EFFECT_SCORE_BONUS);
  }

  /**
   * Calculates an individual opponent's contribution to this attribute's
   * {@linkcode getEffectScore | Effect Score}. Individual score is based on
   * the opponent's projected effectiveness against the Flying type using their
   * best (estimated) move.
   * - If `effectiveness > 1`, a {@link MINOR_EFFECT_SCORE_BONUS} is given
   * - If `effectiveness < 1`, a {@linkcode MINOR_EFFECT_SCORE_PENALTY} is given
   * - Otherwise, the opponent does not contribute to Effect Score
   * @param opponent the opposing {@linkcode Pokemon} to evaluate
   * @returns the Effect Score granted from the given opponent to this attribute
   */
  private getOpponentScore(opponent: Pokemon) {
    const oppMoveTypes = [...new Set(opponent.estimateAttackMoves().map((mv) => opponent.getMoveType(mv)))];
    const maxEffectivenessAgainstFlying = Math.max(
      ...oppMoveTypes.map((t) => getTypeDamageMultiplier(t, ElementalType.FLYING)),
    );

    if (maxEffectivenessAgainstFlying > 1) {
      return MINOR_EFFECT_SCORE_BONUS;
    }
    if (maxEffectivenessAgainstFlying < 1) {
      return MINOR_EFFECT_SCORE_PENALTY;
    }
    return 0;
  }
}
