import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class RunSuccessAbAttr extends AbAttr {
  constructor() {
    super();
    this._flags.add(AbAttrFlag.RUN_SUCCESS);
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, escapeChance: ValueHolder<number>): void {
    escapeChance.value = 256;
  }
}
