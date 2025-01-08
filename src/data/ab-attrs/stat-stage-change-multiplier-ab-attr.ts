import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class StatStageChangeMultiplierAbAttr extends AbAttr {
  private readonly multiplier: number;

  constructor(multiplier: number) {
    super(true);

    this.multiplier = multiplier;
  }

  override apply(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, stages: NumberHolder): boolean {
    stages.value *= this.multiplier;

    return true;
  }
}
