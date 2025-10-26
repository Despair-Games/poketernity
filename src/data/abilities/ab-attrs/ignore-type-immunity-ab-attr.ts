import { AbAttr } from "#abilities/ab-attr";
import type { ElementalType } from "#enums/elemental-type";
import type { Pokemon } from "#field/pokemon";
import type { ValueHolder } from "#utils/common-utils";

export class IgnoreTypeImmunityAbAttr extends AbAttr {
  protected override readonly abAttrKey = "IgnoreTypeImmunityAbAttr";
  private readonly defenderType: ElementalType;
  private readonly allowedMoveTypes: ElementalType[];

  constructor(defenderType: ElementalType, allowedMoveTypes: ElementalType[]) {
    super();
    this.defenderType = defenderType;
    this.allowedMoveTypes = allowedMoveTypes;
  }

  public override apply(
    _pokemon: Pokemon,
    _simulated: boolean,
    cancelled: ValueHolder<boolean>,
    _moveType: ElementalType,
    _defType: ElementalType,
  ): void {
    cancelled.value = true;
  }

  public override canApply(...[, , , moveType, defType]: Parameters<this["apply"]>): boolean {
    return this.defenderType === defType && this.allowedMoveTypes.includes(moveType);
  }
}
