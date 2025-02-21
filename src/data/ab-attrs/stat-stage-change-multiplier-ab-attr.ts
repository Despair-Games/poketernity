import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbAttr } from "./ab-attr";

export class StatStageChangeMultiplierAbAttr extends AbAttr {
  private readonly multiplier: number;

  constructor(multiplier: number) {
    super(true);
    this._flags.add(AbAttrFlag.STAT_STAGE_CHANGE_MULTIPLIER);

    this.multiplier = multiplier;
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, stages: NumberHolder): boolean {
    stages.value *= this.multiplier;

    return true;
  }
}
