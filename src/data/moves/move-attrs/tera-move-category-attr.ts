import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { MoveCategory } from "#enums/move-category";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveCategoryAttr } from "#moves/variable-move-category-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute used for tera moves that change category based on the user's Atk and SpAtk stats.
 * @extends VariableMoveCategoryAttr
 */
export class TeraMoveCategoryAttr extends VariableMoveCategoryAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move, category: NumberHolder): boolean {
    if (
      user.isTerastallized
      && user.getEffectiveStat(Stat.ATK, target, move, AbilityApplyMode.IGNORE)
        > user.getEffectiveStat(Stat.SPATK, target, move, AbilityApplyMode.IGNORE)
    ) {
      category.value = MoveCategory.PHYSICAL;
      return true;
    }
    return false;
  }
}
