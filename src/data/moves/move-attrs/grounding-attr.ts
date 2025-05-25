import { MINOR_EFFECT_SCORE_BONUS, MINOR_EFFECT_SCORE_PENALTY } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to {@link https://bulbapedia.bulbagarden.net/wiki/Grounded | "ground"}
 * the move's user or target, allowing them to be hit by
 * {@linkcode ElementalType.GROUND | Ground-type} moves and other ground-based effects.
 * @extends AddBattlerTagAttr
 */
export class GroundingAttr extends AddBattlerTagAttr {
  constructor(selfTarget: boolean = true, isAttack: boolean = false) {
    super(BattlerTagType.IGNORE_FLYING, selfTarget, {
      failOnOverlap: !isAttack,
      lastHitOnly: isAttack,
    });
  }

  /**
   * If the affected Pokemon is already grounded, this contributes nothing to Effect Score.
   * Otherwise, this grants a {@linkcode MINOR_EFFECT_SCORE_BONUS} for each Ground-type Pokemon
   * on the opposing side of the affected Pokemon. If the affected Pokemon is on the same
   * side as the user, this bonus is multiplied by -1.
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const pokemon = this.selfTarget ? user : target;
    if (pokemon.isGrounded()) {
      return 0;
    }

    const opponents = pokemon.getOpponents();
    const numGroundTypeOpponents = opponents.filter((opp) => opp.isOfType(ElementalType.GROUND, true)).length;

    return (pokemon.isOpponent(user) ? MINOR_EFFECT_SCORE_BONUS : MINOR_EFFECT_SCORE_PENALTY) * numGroundTypeOpponents;
  }
}
