import { AbAttr } from "#abilities/ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { BooleanHolder } from "#utils/common-utils";

export class IgnoreTypeImmunityAbAttr extends AbAttr {
  private readonly defenderType: ElementalType;
  private readonly allowedMoveTypes: ElementalType[];

  constructor(defenderType: ElementalType, allowedMoveTypes: ElementalType[]) {
    super(true);
    this._flags.add(AbAttrFlag.IGNORE_TYPE_IMMUNITY);
    this.defenderType = defenderType;
    this.allowedMoveTypes = allowedMoveTypes;
  }

  public override apply(
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
