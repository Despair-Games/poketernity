import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class StatStageChangeMultiplierAbAttr extends AbAttr {
  private multiplier: integer;

  constructor(multiplier: integer) {
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
    (args[0] as NumberHolder).value *= this.multiplier;

    return true;
  }
}
