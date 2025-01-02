import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveCategoryAttr } from "#app/data/move-attrs/variable-move-category-attr";

/**
 * Change the move category to status when used on the user's ally.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Pollen_Puff_(move) Pollen Puff}.
 * @extends VariableMoveCategoryAttr
 */
export class StatusCategoryOnAllyAttr extends VariableMoveCategoryAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, category: NumberHolder): boolean {
    if (user.getAlly() === target) {
      category.value = MoveCategory.STATUS;
      return true;
    }

    return false;
  }
}
