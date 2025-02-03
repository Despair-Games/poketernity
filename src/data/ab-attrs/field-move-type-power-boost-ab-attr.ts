import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ElementalType } from "#enums/elemental-type";
import { PreAttackFieldMoveTypePowerBoostAbAttr } from "./pre-attack-field-move-type-power-boost-ab-attr";

/**
 * Boosts the power of a specific type of move for all Pokemon in the field.
 * @extends PreAttackFieldMoveTypePowerBoostAbAttr
 */
export class FieldMoveTypePowerBoostAbAttr extends PreAttackFieldMoveTypePowerBoostAbAttr {
  constructor(boostedType: ElementalType, powerMultiplier: number = 1.5) {
    super(boostedType, powerMultiplier);

    this._flags.add(AbAttrFlag.FIELD_MOVE_TYPE_POWER_BOOST);
  }
}
