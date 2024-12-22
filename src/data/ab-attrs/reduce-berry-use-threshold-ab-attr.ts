import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class ReduceBerryUseThresholdAbAttr extends AbAttr {
  override apply(
    pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    const hpRatio = pokemon.getHpRatio();
    const threshold: NumberHolder = args[0];

    if (threshold.value < hpRatio) {
      threshold.value *= 2;
      return threshold.value >= hpRatio;
    }

    return false;
  }
}
