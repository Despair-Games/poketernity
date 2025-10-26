import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class BlockNonDirectDamageAbAttr extends AbAttr {
  protected override readonly abAttrKey = "BlockNonDirectDamageAbAttr";

  public override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: ValueHolder<boolean>): void {
    cancelled.value = true;
  }
}
