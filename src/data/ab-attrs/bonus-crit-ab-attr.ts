import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class BonusCritAbAttr extends AbAttr {
  override apply(_pokemon: Pokemon, _simulated: boolean, bonusCrit: BooleanHolder): boolean {
    bonusCrit.value = true;
    return true;
  }
}
