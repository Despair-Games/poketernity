import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Taunt_(move) | Taunt's} effect.
 * Prevents the target from selecting or using Status moves for 4 turns.
 * @extends AddBattlerTagAttr
 */
export class TauntAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.TAUNT, false, { failOnOverlap: true, turnCountMin: 4 });
  }

  /**
   * Grants (+1) + 60%(+1) if the target isn't expected to have any threatening attacks
   * (i.e. the {@linkcode Pokemon.getExpectedAttackScore | EAS} of all of the target's attacks
   * against the user is less than or equal to 1)
   */
  public override getEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const targetAttacks = target.estimateAttackMoves();

    if (targetAttacks.every((mv) => target.getExpectedAttackScore(user, mv) <= 1)) {
      return MINOR_EFFECT_SCORE_BONUS + this.getRandomScore(user, 60);
    }
    return 0;
  }
}
