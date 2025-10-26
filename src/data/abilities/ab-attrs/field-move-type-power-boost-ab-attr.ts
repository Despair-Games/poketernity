import { PreAttackFieldMoveTypePowerBoostAbAttr } from "#abilities/pre-attack-field-move-type-power-boost-ab-attr";
import type { ElementalType } from "#enums/elemental-type";

/**
 * Boosts the power of a specific type of move for all Pokemon in the field.
 */
export class FieldMoveTypePowerBoostAbAttr extends PreAttackFieldMoveTypePowerBoostAbAttr {
  protected override readonly abAttrKey = "FieldMoveTypePowerBoostAbAttr";

  constructor(boostedType: ElementalType, powerMultiplier: number = 1.5) {
    super(boostedType, powerMultiplier);
  }
}
