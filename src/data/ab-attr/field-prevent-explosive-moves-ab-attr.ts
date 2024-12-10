import type Pokemon from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttr } from "./ab-attr";

export class FieldPreventExplosiveMovesAbAttr extends AbAttr {
  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    _args: any[],
  ): boolean {
    cancelled.value = true;
    return true;
  }
}
