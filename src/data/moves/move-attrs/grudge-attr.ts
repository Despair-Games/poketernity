import { KO_ATTACK_SCORE, MAJOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Grudge_(move) | Grudge's} effect.
 * If the user is knocked out by another Pokemon this turn, this
 * depletes the PP of the attacker's last used move.
 * @extends AddBattlerTagAttr
 */
export class GrudgeAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.GRUDGE, true, { turnCountMin: 1, failOnOverlap: true });
  }

  /**
   * Grants a {@link MAJOR_EFFECT_SCORE_BONUS | major bonus} if the user
   * expects to faint from at least one opponent's attack
   */
  public override getRawEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const expectsToFaint = user
      .getOpponents()
      .some((opp) => opp.estimateAttackMoves().some((mv) => opp.getExpectedAttackScore(user, mv) >= KO_ATTACK_SCORE));

    return expectsToFaint ? MAJOR_EFFECT_SCORE_BONUS : 0;
  }
}
