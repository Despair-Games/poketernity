import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { PreAttackAbAttr } from "./pre-attack-ab-attr";

/**
 * Class for abilities that convert single-strike moves to two-strike moves (i.e. Parental Bond).
 * @param damageMultiplier the damage multiplier for the second strike, relative to the first.
 * @extends PreAttackAbAttr
 */
export class AddSecondStrikeAbAttr extends PreAttackAbAttr {
  private readonly damageMultiplier: number;

  constructor(damageMultiplier: number) {
    super(false);

    this.damageMultiplier = damageMultiplier;
  }

  /**
   * If conditions are met, this increases the move's hit count (via args[0])
   * or multiplies the damage of secondary strikes (via args[1])
   * @param pokemon the {@linkcode Pokemon} using the move
   * @param move the {@linkcode Move} used by the ability source
   * @param args Additional arguments:
   * - `[0]` the number of strikes this move currently has ({@linkcode NumberHolder})
   * - `[1]` the damage multiplier for the current strike ({@linkcode NumberHolder})
   * @returns
   */
  override applyPreAttack(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _defender: Pokemon,
    move: Move,
    args: any[],
  ): boolean {
    const hitCount = args[0] as NumberHolder;
    const multiplier = args[1] as NumberHolder;

    if (move.canBeMultiStrikeEnhanced(pokemon)) {
      this.showAbility = !!hitCount?.value;
      if (hitCount?.value) {
        hitCount.value += 1;
      }

      if (multiplier?.value && pokemon.turnData.hitsLeft === 1) {
        multiplier.value = this.damageMultiplier;
      }
      return true;
    }
    return false;
  }
}
