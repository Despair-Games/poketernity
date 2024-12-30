import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveCategoryAttr } from "#app/data/move-attrs/variable-move-category-attr";

/**
 * Change the move category to status when used on the ally
 * @extends VariableMoveCategoryAttr
 * @see {@linkcode apply}
 */
export class StatusCategoryOnAllyAttr extends VariableMoveCategoryAttr {
  /**
   * @param user {@linkcode Pokemon} using the move
   * @param target {@linkcode Pokemon} target of the move
   * @param _move {@linkcode Move} with this attribute
   * @param category {@linkcode NumberHolder} containing the move's category for the turn
   * @returns true if the function succeeds
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move, category: NumberHolder): boolean {
    if (user.getAlly() === target) {
      category.value = MoveCategory.STATUS;
      return true;
    }

    return false;
  }
}
