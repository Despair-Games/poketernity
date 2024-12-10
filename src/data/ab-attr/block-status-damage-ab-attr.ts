import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { StatusEffect } from "#enums/status-effect";
import { AbAttr } from "./ab-attr";

/**
 * This attribute will block any status damage that you put in the parameter.
 */
export class BlockStatusDamageAbAttr extends AbAttr {
  private effects: StatusEffect[];

  /**
   * @param effects The {@linkcode StatusEffect | status effect(s)} that will be blocked from damaging the ability pokemon
   */
  constructor(...effects: StatusEffect[]) {
    super(false);

    this.effects = effects;
  }

  /**
   * @param pokemon The {@linkcode Pokemon} with the ability
   * @param passive N/A
   * @param cancelled {@linkcode BooleanHolder} whether to cancel the status damage
   * @param N/A
   * @returns Returns `true` if status damage is blocked
   */
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    if (pokemon.status && this.effects.includes(pokemon.status.effect)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}
