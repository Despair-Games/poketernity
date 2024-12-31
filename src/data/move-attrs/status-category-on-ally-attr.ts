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
  /** Sets the move's category to {@linkcode MoveCategory.STATUS Status} if the target is the user's ally */
  override apply(user: Pokemon, target: Pokemon, _move: Move, category: NumberHolder): boolean {
    if (user.getAlly() === target) {
      category.value = MoveCategory.STATUS;
      return true;
    }

    return false;
  }
}
