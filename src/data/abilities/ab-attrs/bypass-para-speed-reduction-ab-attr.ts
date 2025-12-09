import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

/**
 * Ability attribute that allows the ability holder to ignore the speed reduction from Paralysis.
 * Used by the ability Quick Feet
 */
export class BypassParaSpeedReductionAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BypassParaSpeedReductionAbAttr";

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: ValueHolder<boolean>): void {
    cancelled.value = true;
  }
}
