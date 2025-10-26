import { PreAttackFieldMoveTypePowerBoostAbAttr } from "#abilities/pre-attack-field-move-type-power-boost-ab-attr";

/**
 * Boosts the power of a specific type of move for the user and its allies.
 */
export class UserFieldMoveTypePowerBoostAbAttr extends PreAttackFieldMoveTypePowerBoostAbAttr {
  protected override readonly abAttrKey = "UserFieldMoveTypePowerBoostAbAttr";
}
