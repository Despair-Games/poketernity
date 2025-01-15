import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class ReduceBerryUseThresholdAbAttr extends AbAttr {
  override apply(pokemon: Pokemon, _simulated: boolean, threshold: NumberHolder): boolean {
    const hpRatio = pokemon.getHpRatio();

    if (threshold.value < hpRatio) {
      threshold.value *= 2;
      return threshold.value >= hpRatio;
    }

    return false;
  }
}
