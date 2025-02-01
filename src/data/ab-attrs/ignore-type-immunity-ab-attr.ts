import type { Pokemon } from "#app/field/pokemon";
import type { BooleanHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ElementType } from "#enums/element-type";
import { AbAttr } from "./ab-attr";

export class IgnoreTypeImmunityAbAttr extends AbAttr {
  private readonly defenderType: ElementType;
  private readonly allowedMoveTypes: ElementType[];

  constructor(defenderType: ElementType, allowedMoveTypes: ElementType[]) {
    super(true);
    this._flags.add(AbAttrFlag.IGNORE_TYPE_IMMUNITY);
    this.defenderType = defenderType;
    this.allowedMoveTypes = allowedMoveTypes;
  }

  override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    cancelled: BooleanHolder,
    moveType: ElementType,
    defType: ElementType,
  ): boolean {
    if (this.defenderType === defType && this.allowedMoveTypes.includes(moveType)) {
      cancelled.value = true;
      return true;
    }
    return false;
  }
}
