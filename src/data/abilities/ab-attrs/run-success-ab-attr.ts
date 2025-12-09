import { AbAttr } from "#abilities/ab-attr";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class RunSuccessAbAttr extends AbAttr {
  protected override readonly abAttrKey = "RunSuccessAbAttr";

  public override apply(_pokemon: Pokemon, _simulated: boolean, escapeChance: ValueHolder<number>): void {
    escapeChance.value = 256;
  }
}
