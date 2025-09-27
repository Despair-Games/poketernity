import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import { toDmgValue, type ValueHolder } from "#utils/common-utils";

/**
 * Causes Pokemon to take reduced damage from the {@linkcode StatusEffect.BURN | Burn} status
 * @param multiplier Multiplied with the damage taken
 */
export class ReduceBurnDamageAbAttr extends AbAttr {
  protected multiplier: number;

  constructor(multiplier: number) {
    super();
    this._flags.add(AbAttrFlag.REDUCE_BURN_DAMAGE);

    this.multiplier = multiplier;
  }

  /**
   * Applies the damage reduction
   * @param pokemon N/A
   * @param simulated N/A
   * @param damage {@linkcode NumberHolder} The damage value being modified
   */
  public override apply(_pokemon: Pokemon, _simulated: boolean, damage: ValueHolder<number>): void {
    damage.value = toDmgValue(damage.value * this.multiplier);
  }
}
