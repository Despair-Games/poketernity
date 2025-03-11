import { MoveCategory } from "#enums/move-category";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/moves/move";
import { VariableMoveCategoryAttr } from "#app/data/moves/move-attrs/variable-move-category-attr";
import { AbilityApplyMode } from "#enums/ability-apply-mode";

/**
 * Attribute used for tera moves that change category based on the user's Atk and SpAtk stats.
 * @extends VariableMoveCategoryAttr
 */
export class TeraMoveCategoryAttr extends VariableMoveCategoryAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move, category: NumberHolder): boolean {
    if (
      user.isTerastallized()
      && user.getEffectiveStat(Stat.ATK, target, move, AbilityApplyMode.IGNORE)
        > user.getEffectiveStat(Stat.SPATK, target, move, AbilityApplyMode.IGNORE)
    ) {
      category.value = MoveCategory.PHYSICAL;
      return true;
    }
    return false;
  }
}
