import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { StatusEffect } from "#enums/status-effect";
import { AbAttr } from "./ab-attr";

/**
 * This attribute reduces the duration of sleep by half and is used by the ability Early Bird.
 * Early Bird halves the sleep duration. When the Pokémon is put to sleep, the number of turns it will remain asleep is preset, between 1 and 5 (the range depends on the generation).
 * This number of turns is halved for a Pokémon with Early Bird, rounded down if it is odd. So if only 1 turn is preset, it is rounded down to 0, causing the Pokémon to wake up the next time it moves.
 * @param statusEffect - The {@linkcode StatusEffect} to check for
 * @see {@linkcode apply}
 */
export class ReduceSleepDurationAbAttr extends AbAttr {
  private readonly statusEffect: StatusEffect = StatusEffect.SLEEP;

  constructor() {
    super(true);
  }

  /**
   * Halves the pre-generated / provided number of turns asleep when the status effect is set
   * @param args - The args passed to the `AbAttr`:
   * - `[0]` - The {@linkcode StatusEffect} of the Pokemon
   * - `[1]` - the predetermined number of turns asleep
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
    const turnsRemaining = args[1] as NumberHolder;
    if (statusEffect === this.statusEffect) {
      turnsRemaining.value = Math.floor(turnsRemaining.value / 2);
      return true;
    }

    return false;
  }
}
