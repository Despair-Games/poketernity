import { BAD_MOVE_PENALTY, MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply the {@link https://bulbapedia.bulbagarden.net/wiki/Status_condition#Drowsy | Drowsy}
 * status condition to the target.
 * @extends AddBattlerTagAttr
 */
export class DrowsyAttr extends AddBattlerTagAttr {
  constructor(isAttack: boolean = false, effectChanceOverride?: number) {
    super(BattlerTagType.DROWSY, false, {
      failOnOverlap: !isAttack,
      effectChanceOverride,
    });
  }

  /**
   * Grants (+1) + 30%(+1) if the target can become Drowsy.
   * Otherwise, if this effect is from a Status move, this grants a {@linkcode BAD_MOVE_PENALTY}.
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    if (target.canAddTag(this.tagType)) {
      return MINOR_EFFECT_SCORE_BONUS + this.getRandomScore(user, 30);
    }
    return move.isStatusMove() ? BAD_MOVE_PENALTY : 0;
  }
}
