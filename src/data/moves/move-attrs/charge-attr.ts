import { MAJOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { ElementalType } from "#enums/elemental-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply the power-boosting effect of {@link https://bulbapedia.bulbagarden.net/wiki/Charge_(move) | Charge}.
 * Doubles the power of the user's next Electric-type attack.
 * @extends AddBattlerTagAttr
 */
export class ChargeAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.CHARGED, true);
  }

  /** Grants 30%(+2) if the user knows an Electric-type attack and isn't already "Charged" */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const userKnowsElectricAttack = user
      .getAttackMoves(true)
      .some((mv) => user.getMoveType(mv) === ElementalType.ELECTRIC);

    return userKnowsElectricAttack && !user.hasTag(BattlerTagType.CHARGED)
      ? this.getRandomScore(user, 30, MAJOR_EFFECT_SCORE_BONUS)
      : 0;
  }
}
