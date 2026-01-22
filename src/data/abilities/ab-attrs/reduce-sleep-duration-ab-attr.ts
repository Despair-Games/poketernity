import { AbAttr } from "#abilities/ab-attr";
import { StatusEffect } from "#enums/status-effect";
import type { StatusEffectAbAttrParams } from "#types/ab-attr-param-types";

/**
 * This attribute reduces the duration of sleep by half by causing
 * the sleep turns remaining counter to tick down an extra time each turn.
 * @see {@linkcode https://bulbapedia.bulbagarden.net/wiki/Early_Bird_(Ability) | Early Bird (Bulbapedia)}
 */
export class ReduceSleepDurationAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ReduceSleepDurationAbAttr";

  private readonly statusEffect = StatusEffect.SLEEP;

  public override apply({ pokemon }: StatusEffectAbAttrParams): void {
    pokemon.advanceStatusCounter();
  }

  public override canApply({ effect }: Parameters<this["apply"]>[0]): boolean {
    return effect === this.statusEffect;
  }
}
