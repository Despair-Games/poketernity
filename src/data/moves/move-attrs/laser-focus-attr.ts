import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply {@link https://bulbapedia.bulbagarden.net/wiki/Laser_Focus_(move) | Laser Focus'}
 * effect. Causes the user to always critically hit until the
 * end of the next turn.
 * @extends AddBattlerTagAttr
 * @todo Check if overlap logic is correct; there may be P3 errors
 */
export class LaserFocusAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.ALWAYS_CRIT, true);
  }

  /**
   * Grants 40%(+1) if the user has a move of at least moderate
   * {@linkcode Pokemon.getExpectedAttackScore | EAS} against an opponent
   */
  public override getRawEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const opponents = user.getOpponents();
    const userHasThreatMove = user
      .getAttackMoves(true)
      .some((attack) => opponents.some((opp) => user.getExpectedAttackScore(opp, attack) >= 1));

    return userHasThreatMove ? this.getRandomScore(user, 40) : 0;
  }
}
