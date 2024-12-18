import type { MoveCategory } from "#app/data/move";
import { FieldMovePowerBoostAbAttr } from "./field-move-power-boost-ab-attr";

/**
 * Boosts the power of moves in specified categories.
 * @param boostedCategories - The categories of moves that will receive the power boost.
 * @param powerMultiplier - The multiplier to apply to the move's power.
 * @extends FieldMovePowerBoostAbAttr
 */
export class AllyMoveCategoryPowerBoostAbAttr extends FieldMovePowerBoostAbAttr {
  constructor(boostedCategories: MoveCategory[], powerMultiplier: number) {
    super((_pokemon, _defender, move) => boostedCategories.includes(move.category), powerMultiplier);
  }
}
