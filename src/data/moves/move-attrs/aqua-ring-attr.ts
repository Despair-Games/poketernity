import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Aqua_Ring_(move) | Aqua Ring's}
 * effect. Restores 1/16th of the user's max HP at the end of each turn.
 * @extends AddBattlerTagAttr
 */
export class AquaRingAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.AQUA_RING, true, { failOnOverlap: true });
  }

  /**
   * Grants a {@link MINOR_EFFECT_SCORE_BONUS | minor bonus} if the user doesn't expect to take
   * significant damage from any of the opponents' estimated attacks
   */
  public override getRawEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const userIsDefensivelyFavored = user
      .getOpponents()
      .every((opp) => opp.estimateAttackMoves().every((mv) => opp.getExpectedAttackScore(user, mv) < 1));
    return userIsDefensivelyFavored ? MINOR_EFFECT_SCORE_BONUS : 0;
  }
}
