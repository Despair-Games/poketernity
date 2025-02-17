import { MoveCategory } from "#enums/move-category";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveCategoryAttr } from "#app/data/move-attrs/variable-move-category-attr";
import { AbilityApplyMode } from "#enums/ability-apply-mode";

/**
 * Attribute to change move category to match the user's highest effective offensive stat.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Photon_Geyser_(move) | Photon Geyser}.
 * And all G-Max Moves
 * @extends VariableMoveCategoryAttr
 */
export class UseHigherAttackingStatAttr extends VariableMoveCategoryAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move, category: NumberHolder): boolean {
    let returnVal = false;
    if (
      user.getEffectiveStat(Stat.ATK, target, move, AbilityApplyMode.IGNORE)
      > user.getEffectiveStat(Stat.SPATK, target, move, AbilityApplyMode.IGNORE)
    ) {
      if (category.value === MoveCategory.SPECIAL) {
        returnVal = true;
      }
      category.value = MoveCategory.PHYSICAL;
    } else {
      if (category.value === MoveCategory.PHYSICAL) {
        returnVal = true;
      }
      category.value = MoveCategory.SPECIAL;
    }
    return returnVal;
  }
}
