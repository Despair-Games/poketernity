import type Pokemon from "#app/field/pokemon";
import { type BooleanHolder, NumberHolder } from "#app/utils";
import type { StatusEffect } from "#enums/status-effect";
import { AbAttr } from "./ab-attr";

/**
 * Used by Early Bird, makes the pokemon wake up faster
 * @param statusEffect - The {@linkcode StatusEffect} to check for
 * @see {@linkcode apply}
 */
export class ReduceStatusEffectDurationAbAttr extends AbAttr {
  private statusEffect: StatusEffect;

  constructor(statusEffect: StatusEffect) {
    super(true);

    this.statusEffect = statusEffect;
  }

  /**
   * Reduces the number of sleep turns remaining by an extra 1 when applied
   * @param args - The args passed to the `AbAttr`:
   * - `[0]` - The {@linkcode StatusEffect} of the Pokemon
   * - `[1]` - The number of turns remaining until the status is healed
   * @returns `true` if the ability was applied
   */
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const statusEffect: StatusEffect = args[0];
    const turnsRemaining = args[1];
    if (!(turnsRemaining instanceof NumberHolder)) {
      return false;
    }
    if (statusEffect === this.statusEffect) {
      turnsRemaining.value -= 1;
      return true;
    }

    return false;
  }
}
