import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class BypassBurnDamageReductionAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BypassBurnDamageReductionAbAttr";

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: ValueHolder<boolean>): void {
    cancelled.value = true;
  }
}
