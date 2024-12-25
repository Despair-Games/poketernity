import type { Pokemon } from "#app/field/pokemon";
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
    const stabMultiplier: NumberHolder = args[0];
    if (stabMultiplier.value > 1) {
      stabMultiplier.value += 0.5;
      return true;
    }

    return false;
  }
}
