import { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveCategoryAttr } from "#app/data/move-attrs/variable-move-category-attr";

/**
 * Change the move category to status when used on the user's ally.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Pollen_Puff_(move) | Pollen Puff} and {@link https://bulbapedia.bulbagarden.net/wiki/Present_(move) | Present}
 * @extends VariableMoveCategoryAttr
 */
export class ChangeToStatusCategoryAttr extends VariableMoveCategoryAttr {
  private categoryChangeCondition: (user: Pokemon, target: Pokemon, move: Move) => boolean;
  private postCategoryChangeUpdate: ((user: Pokemon, target: Pokemon, move: Move) => void) | null;

  /**
   * @param categoryChangeCondition Condition required for the move to change categories
   * @param postCategoryChangeUpdate Additional, optional changes that should be applied post-category change
   */
  constructor(
    categoryChangeCondition: (user: Pokemon, target: Pokemon, move: Move) => boolean,
    postCategoryChangeUpdate?: ((user: Pokemon, target: Pokemon, move: Move) => void) | null,
  ) {
    super(false);

    this.categoryChangeCondition = categoryChangeCondition;
    this.postCategoryChangeUpdate = postCategoryChangeUpdate ?? null;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move, category: NumberHolder): boolean {
    if (this.categoryChangeCondition(user, target, move)) {
      category.value = MoveCategory.STATUS;
      if (this.postCategoryChangeUpdate) {
        this.postCategoryChangeUpdate(user, target, move);
      }
      return true;
    }

    return false;
  }
}
