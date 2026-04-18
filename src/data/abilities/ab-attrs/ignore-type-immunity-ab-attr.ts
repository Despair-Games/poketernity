import { AbAttr } from "#abilities/ab-attr";
import type { ElementalType } from "#enums/elemental-type";
import type { IgnoreTypeImmunityAbAttrParams } from "#types/ab-attr-param-types";

export class IgnoreTypeImmunityAbAttr extends AbAttr {
  protected override readonly abAttrKey = "IgnoreTypeImmunityAbAttr";

  private readonly defenderType: ElementalType;
  private readonly allowedMoveTypes: ElementalType[];

  constructor(defenderType: ElementalType, allowedMoveTypes: ElementalType[]) {
    super();

    this.defenderType = defenderType;
    this.allowedMoveTypes = allowedMoveTypes;
  }

  public override apply({ cancelled }: IgnoreTypeImmunityAbAttrParams): void {
    cancelled.value = true;
  }

  public override canApply({ moveType, defType }: Parameters<this["apply"]>[0]): boolean {
    return this.defenderType === defType && this.allowedMoveTypes.includes(moveType);
  }
}
