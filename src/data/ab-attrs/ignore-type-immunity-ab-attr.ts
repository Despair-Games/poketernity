import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import type { ElementalType } from "#enums/elemental-type";
import { AbAttr } from "./ab-attr";

export class IgnoreTypeImmunityAbAttr extends AbAttr {
  private readonly defenderType: ElementalType;
  private readonly allowedMoveTypes: ElementalType[];

  constructor(defenderType: ElementalType, allowedMoveTypes: ElementalType[]) {
    super(true);
    this.defenderType = defenderType;
    this.allowedMoveTypes = allowedMoveTypes;
  }

  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    cancelled: BooleanHolder,
    moveType: ElementalType,
    defType: ElementalType,
  ): boolean {
    if (this.defenderType === defType && this.allowedMoveTypes.includes(moveType)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}
