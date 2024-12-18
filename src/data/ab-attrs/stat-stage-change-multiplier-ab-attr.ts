import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class StatStageChangeMultiplierAbAttr extends AbAttr {
  private multiplier: number;

  constructor(multiplier: number) {
    super(true);

    this.multiplier = multiplier;
  }

  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const stages: NumberHolder = args[0];
    stages.value *= this.multiplier;

    return true;
  }
}
