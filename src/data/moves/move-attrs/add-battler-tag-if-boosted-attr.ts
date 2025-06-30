import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import { ConfuseAttr } from "#moves/confuse-attr";
import type { Move } from "#moves/move";

/**
 * Attribute to apply a battler tag to the target if they have had their stats boosted this turn.
 */
export class ConfuseIfBoostedAttr extends ConfuseAttr {
  override canApply(user: Pokemon, target: Pokemon, move: Move): boolean {
    return target.turnData.statStagesIncreased && super.canApply(user, target, move);
  }

  /**
   * Applies the Effect Score bonus from standard Confusion, but only during the
   * first turn the target has entered battle.
   */
  public override getRawEffectScore(user: EnemyPokemon, target: Pokemon, move: Move): number {
    if (target.summonData.waveTurnCount <= 1) {
      return super.getRawEffectScore(user, target, move);
    }
    return 0;
  }
}
