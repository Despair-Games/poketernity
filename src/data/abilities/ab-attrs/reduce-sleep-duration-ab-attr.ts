import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";

/**
 * This attribute reduces the duration of sleep by half and is used by the ability Early Bird.
 * Early Bird halves the sleep duration. When the Pokémon is put to sleep, the number of turns it will remain asleep is preset, between 1 and 3.
 * This number of turns is halved for a Pokémon with Early Bird, rounded down if it is odd. So if only 1 turn is preset, it is rounded down to 0, causing the Pokémon to wake up the next time it moves.
 * @param statusEffect - The {@linkcode StatusEffect} to check for
 */
export class ReduceSleepDurationAbAttr extends AbAttr {
  private readonly statusEffect: StatusEffect = StatusEffect.SLEEP;

  constructor() {
    super();
    this._flags.add(AbAttrFlag.REDUCE_SLEEP_DURATION);
  }

  public override apply(pokemon: Pokemon, _simulated: boolean, _statusEffect: StatusEffect): void {
    pokemon.advanceStatusCounter();
  }

  public override canApply(...[, , statusEffect]: Parameters<this["apply"]>): boolean {
    return statusEffect === this.statusEffect;
  }
}
