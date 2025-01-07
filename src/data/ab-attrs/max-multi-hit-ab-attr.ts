import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class MaxMultiHitAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    hitValue: NumberHolder,
  ): boolean {
    hitValue.value = 0;

    return true;
  }
}
