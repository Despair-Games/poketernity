import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class DoubleBerryEffectAbAttr extends AbAttr {
  override apply(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, berryEffect: NumberHolder): boolean {
    berryEffect.value *= 2;
    return true;
  }
}
