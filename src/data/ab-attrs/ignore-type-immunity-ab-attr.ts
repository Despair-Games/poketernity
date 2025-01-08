import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { Type } from "#enums/type";
import { AbAttr } from "./ab-attr";

export class IgnoreTypeImmunityAbAttr extends AbAttr {
  private readonly defenderType: Type;
  private readonly allowedMoveTypes: Type[];

  constructor(defenderType: Type, allowedMoveTypes: Type[]) {
    super(true);
    this.defenderType = defenderType;
    this.allowedMoveTypes = allowedMoveTypes;
  }

  override apply(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    cancelled: BooleanHolder,
    moveType: Type,
    defType: Type,
  ): boolean {
    if (this.defenderType === defType && this.allowedMoveTypes.includes(moveType)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}
