import type { Pokemon } from "#app/field/pokemon";
import { type NumberHolder, toDmgValue } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

/**
 * Causes Pokemon to take reduced damage from the {@linkcode StatusEffect.BURN | Burn} status
 * @param multiplier Multiplied with the damage taken
 */
export class ReduceBurnDamageAbAttr extends AbAttr {
  constructor(protected multiplier: number) {
    super(false);
    this._flags.add(AbAttrFlag.REDUCE_BURN_DAMAGE);
  }

  /**
   * Applies the damage reduction
   * @param pokemon N/A
   * @param simulated N/A
   * @param damage {@linkcode NumberHolder} The damage value being modified
   * @returns `true`
   */
  override apply(_pokemon: Pokemon, _simulated: boolean, damage: NumberHolder): boolean {
    damage.value = toDmgValue(damage.value * this.multiplier);

    return true;
  }
}
