import type { Type } from "#enums/type";
import { FieldMovePowerBoostAbAttr } from "./field-move-power-boost-ab-attr";

/**
 * Boosts the power of a specific type of move.
 * @param boostedType - The type of move that will receive the power boost.
 * @param powerMultiplier - The multiplier to apply to the move's power, defaults to 1.5 if not provided.
 * @extends FieldMovePowerBoostAbAttr
 */
export class PreAttackFieldMoveTypePowerBoostAbAttr extends FieldMovePowerBoostAbAttr {
  constructor(boostedType: Type, powerMultiplier: number = 1.5) {
    super((pokemon, _defender, move) => pokemon?.getMoveType(move) === boostedType, powerMultiplier);
  }
}
