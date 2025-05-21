import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { Pokemon } from "#field/pokemon";
import type { NumberHolder } from "#utils/common-utils";

export class StatStageChangeMultiplierAbAttr extends AbAttr {
  private readonly multiplier: number;

  constructor(multiplier: number) {
    super(true);
    this._flags.add(AbAttrFlag.STAT_STAGE_CHANGE_MULTIPLIER);

    this.multiplier = multiplier;
  }

  public override apply(_pokemon: Pokemon, _simulated: boolean, stages: NumberHolder): boolean {
    stages.value *= this.multiplier;

    return true;
  }
}
