import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import { type NumberHolder, toDmgValue } from "#utils/common-utils";

/**
 * Causes Pokemon to take reduced damage from the {@linkcode StatusEffect.BURN | Burn} status
 * @param multiplier Multiplied with the damage taken
 */
export class ReduceBurnDamageAbAttr extends AbAttr {
  protected multiplier: number;

  constructor(multiplier: number) {
    super(false);
    this._flags.add(AbAttrFlag.REDUCE_BURN_DAMAGE);

    this.multiplier = multiplier;
  }

  /**
   * Applies the damage reduction
   * @param pokemon N/A
   * @param simulated N/A
   * @param damage {@linkcode NumberHolder} The damage value being modified
   * @returns `true`
   */
  public override apply(_pokemon: Pokemon, _simulated: boolean, damage: NumberHolder): boolean {
    damage.value = toDmgValue(damage.value * this.multiplier);

    return true;
  }
}
