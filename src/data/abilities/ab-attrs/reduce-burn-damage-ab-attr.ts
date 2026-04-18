import { AbAttr } from "#abilities/ab-attr";
import type { ReduceBurnDamageAbAttrParams } from "#types/ab-attr-param-types";
import { toDmgValue } from "#utils/common-utils";

/**
 * Causes Pokemon to take reduced damage from the Burn status
 * @param multiplier - Multiplied with the damage taken
 */
export class ReduceBurnDamageAbAttr extends AbAttr {
  protected override readonly abAttrKey = "ReduceBurnDamageAbAttr";

  protected multiplier: number;

  constructor(multiplier: number) {
    super();

    this.multiplier = multiplier;
  }

  public override apply({ damage }: ReduceBurnDamageAbAttrParams): void {
    damage.value = toDmgValue(damage.value * this.multiplier);
  }
}
