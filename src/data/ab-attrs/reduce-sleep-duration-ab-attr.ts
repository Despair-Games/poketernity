import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { StatusEffect } from "#enums/status-effect";
import { AbAttr } from "./ab-attr";

/**
 * /**
 * This attribute reduces the duration of sleep by half and is used by the ability Early Bird.
 * Early Bird halves the sleep duration. When the Pokémon is put to sleep, the number of turns it will remain asleep is preset, between 1 and 3.
 * This number of turns is halved for a Pokémon with Early Bird, rounded down if it is odd. So if only 1 turn is preset, it is rounded down to 0, causing the Pokémon to wake up the next time it moves.
 * @param statusEffect - The {@linkcode StatusEffect} to check for
 * @see {@linkcode apply}
 */
export class ReduceSleepDurationAbAttr extends AbAttr {
  private readonly statusEffect: StatusEffect = StatusEffect.SLEEP;

  constructor() {
    super(true);
    this._flags.add(AbAttrFlag.REDUCE_SLEEP_DURATION);
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
    _simulated: boolean,
    statusEffect: StatusEffect,
    turnsRemaining: NumberHolder,
  ): boolean {
    if (statusEffect === this.statusEffect) {
      turnsRemaining.value -= 1;
      return true;
    }

    return false;
  }
}
