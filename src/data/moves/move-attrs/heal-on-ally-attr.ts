import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { HealAttr } from "#moves/heal-attr";
import type { Move } from "#moves/move";

/**
 * Heals the target only if it is the ally.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Pollen_Puff_(move) | Pollen Puff}.
 */
export class HealOnAllyAttr extends HealAttr {
  public override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (user.getAlly() === target) {
      user.stopMultiHit();
      super.apply(user, target, move);
      return true;
    }

    return false;
  }

  /**
   * This is the same scoring logic as in {@linkcode HealAttr.getEffectScore}, except
   * that the penalty for targeting an opponent with the effect is removed.
   */
  public override getEffectScore(user: EnemyPokemon, target: EnemyPokemon, move: Move): number {
    if (target.isOpponent(user)) {
      return 0;
    }

    return this.getAllyTargetScore(user, target, move);
  }
}
