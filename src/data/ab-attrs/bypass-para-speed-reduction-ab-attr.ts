import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

/**
 * Ability attribute that allows the ability holder to ignore the speed reduction from Paralysis.
 * Used by the ability Quick Feet
 * @extends AbAttr
 */
export class BypassParaSpeedReductionAbAttr extends AbAttr {
  constructor() {
    super(false);
  }

  override apply(_pokemon: Pokemon, _simulated: boolean, cancelled: BooleanHolder): boolean {
    cancelled.value = true;
    return true;
  }
}
