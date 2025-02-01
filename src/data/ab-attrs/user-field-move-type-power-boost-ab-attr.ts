import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ElementType } from "#enums/element-type";
import { PreAttackFieldMoveTypePowerBoostAbAttr } from "./pre-attack-field-move-type-power-boost-ab-attr";

/**
 * Boosts the power of a specific type of move for the user and its allies.
 * @extends PreAttackFieldMoveTypePowerBoostAbAttr
 */
export class UserFieldMoveTypePowerBoostAbAttr extends PreAttackFieldMoveTypePowerBoostAbAttr {
  constructor(boostedType: ElementType) {
    super(boostedType);
    this._flags.add(AbAttrFlag.USER_FIELD_MOVE_TYPE_POWER_BOOST);
  }
}
