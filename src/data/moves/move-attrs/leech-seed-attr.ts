import { MINOR_EFFECT_SCORE_BONUS } from "#constants/ai-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { AddBattlerTagAttr } from "#moves/add-battler-tag-attr";
import type { Move } from "#moves/move";

/**
 * Adds a {@link https://bulbapedia.bulbagarden.net/wiki/Seeding | Seeding} effect to the target
 * as seen with Leech Seed and Sappy Seed.
 */
export class LeechSeedAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.SEEDED);
  }

  /**
   * Grants a 70%(+1) bonus.
   * Also grants a {@link MINOR_EFFECT_SCORE_BONUS | minor bonus} if the target isn't
   * expected to deal significant (>40% max HP) damage to the user with any attack
   * or the target is trapped by any effect.
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, _move: Move): number {
    const userIsDefensivelyFavored = target
      .estimateAttackMoves()
      .every((mv) => target.getExpectedAttackScore(user, mv) <= 1);

    return (
      this.getRandomScore(user, 70) + (userIsDefensivelyFavored || target.isTrapped() ? MINOR_EFFECT_SCORE_BONUS : 0)
    );
  }
}
