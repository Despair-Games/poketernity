import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class MaxMultiHitAbAttr extends AbAttr {
  override apply(_pokemon: Pokemon, _simulated: boolean, hitValue: NumberHolder): boolean {
    hitValue.value = 0;

    return true;
  }
}
