import { FieldMovePowerBoostAbAttr } from "#abilities/field-move-power-boost-ab-attr";
import type { ElementalType } from "#enums/elemental-type";

/**
 * Boosts the power of a specific type of move.
 * @param boostedType - The type of move that will receive the power boost.
 * @param powerMultiplier - (Default `1.5`) The multiplier to apply to the move's power
 */
export abstract class PreAttackFieldMoveTypePowerBoostAbAttr extends FieldMovePowerBoostAbAttr {
  constructor(boostedType: ElementalType, powerMultiplier: number = 1.5) {
    super((pokemon, _defender, move) => !!move && pokemon?.getMoveType(move) === boostedType, powerMultiplier);
  }
}
