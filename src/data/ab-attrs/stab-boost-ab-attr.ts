import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class StabBoostAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    if ((args[0] as NumberHolder).value > 1) {
      (args[0] as NumberHolder).value += 0.5;
      return true;
    }

    return false;
  }
}
