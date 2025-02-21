import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { StatusEffect } from "#enums/status-effect";
import { AbAttr } from "./ab-attr";

/**
 * This attribute will block any status damage that you put in the parameter.
 * @param effects - The {@linkcode StatusEffect | status effect(s)} that will be blocked from damaging the ability pokemon
 * @extends AbAttr
 */
export class BlockStatusDamageAbAttr extends AbAttr {
  private readonly effects: StatusEffect[];

  constructor(...effects: StatusEffect[]) {
    super(false);
    this._flags.add(AbAttrFlag.BLOCK_STATUS_DAMAGE);

    this.effects = effects;
  }

  /**
   * @param pokemon The {@linkcode Pokemon} with the ability
   * @param passive N/A
   * @param cancelled {@linkcode BooleanHolder} whether to cancel the status damage
   * @param N/A
   * @returns Returns `true` if status damage is blocked
   */
  override apply(pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    if (pokemon.status && this.effects.includes(pokemon.status.effect)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}
