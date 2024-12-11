import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder, NumberHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class RunSuccessAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _cancelled: BooleanHolder,
    args: any[],
  ): boolean {
    (args[0] as NumberHolder).value = 256;

    return true;
  }
}
