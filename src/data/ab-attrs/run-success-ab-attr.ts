import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class RunSuccessAbAttr extends AbAttr {
  override apply(_pokemon: Pokemon, _simulated: boolean, escapeChance: NumberHolder): boolean {
    escapeChance.value = 256;
    return true;
  }
}
