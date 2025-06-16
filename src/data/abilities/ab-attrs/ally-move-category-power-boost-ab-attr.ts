import { FieldMovePowerBoostAbAttr } from "#abilities/field-move-power-boost-ab-attr";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { MoveCategory } from "#enums/move-category";

/**
 * Boosts the power of moves in specified categories.
 * @param boostedCategories - The categories of moves that will receive the power boost.
 * @param powerMultiplier - The multiplier to apply to the move's power.
 */
export class AllyMoveCategoryPowerBoostAbAttr extends FieldMovePowerBoostAbAttr {
  constructor(boostedCategories: MoveCategory[], powerMultiplier: number) {
    super((_pokemon, _defender, move) => !!move && boostedCategories.includes(move.category), powerMultiplier);
    this._flags.add(AbAttrFlag.ALLY_MOVE_CATEGORY_POWER_BOOST);
  }
}
