import { globalScene } from "#app/global-scene";
import { BAD_MOVE_PENALTY, KO_ATTACK_SCORE, MAJOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply the {@link https://bulbapedia.bulbagarden.net/wiki/Center_of_attention | Center of Attention}
 * volatile status condition. Can apply to the user or selected target.
 * @extends AddBattlerTagAttr
 */
export class CenterOfAttentionAttr extends AddBattlerTagAttr {
  constructor(selfTarget: boolean = true) {
    super(BattlerTagType.CENTER_OF_ATTENTION, selfTarget, { failOnOverlap: true });
  }

  /**
   * Grants an Effect Score as follows:
   * - {@linkcode BAD_MOVE_PENALTY} if not in a double battle
   * - (0) if the effect is not self-targeted (i.e. Spotlight has no bonus)
   * - {@linkcode MAJOR_EFFECT_SCORE_BONUS} if the user's ally can KO at least one opponent
   * - (0) if none of the above conditions are met
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (!globalScene.currentBattle.double) {
      return BAD_MOVE_PENALTY;
    }

    if (!this.selfTarget) {
      return 0;
    }

    const ally = user.getAlly();
    const allyCanKO = ally
      ?.getAttackMoves(true)
      .some((mv) => ally.getOpponents().some((opp) => ally.getExpectedAttackScore(opp, mv) >= KO_ATTACK_SCORE));

    return allyCanKO ? MAJOR_EFFECT_SCORE_BONUS : 0;
  }
}
