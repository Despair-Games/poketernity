import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class PreventBerryUseAbAttr extends AbAttr {
  override apply(_pokemon: Pokemon, _passive: boolean, _simulated: boolean, cancelled: BooleanHolder): boolean {
    cancelled.value = true;

    return true;
  }
}
