import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class BonusCritAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    (args[0] as BooleanHolder).value = true;
    return true;
  }
}
