import { MoveCategory } from "#enums/move-category";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveCategoryAttr } from "#app/data/move-attrs/variable-move-category-attr";

/**
 * Attribute used for tera moves that change category based on the user's Atk and SpAtk stats
 * Note: Currently, `getEffectiveStat` does not ignore all abilities that affect stats except those
 * with the attribute of `StatMultiplierAbAttr`
 * TODO: Remove the `.partial()` tag from Tera Blast and Tera Starstorm when the above issue is resolved
 * @extends VariableMoveCategoryAttr
 */
export class TeraMoveCategoryAttr extends VariableMoveCategoryAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move, category: NumberHolder): boolean {
    if (user.isTerastallized() && user.getEffectiveStat(Stat.ATK, target) > user.getEffectiveStat(Stat.SPATK, target)) {
      category.value = MoveCategory.PHYSICAL;
      return true;
    }
    return false;
  }
}
