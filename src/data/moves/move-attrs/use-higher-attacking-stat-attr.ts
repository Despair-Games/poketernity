import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { MoveCategory } from "#enums/move-category";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveCategoryAttr } from "#moves/variable-move-category-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute to change move category to match the user's highest effective offensive stat.
 *
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Photon_Geyser_(move) | Photon Geyser}
 * and all G-Max Moves.
 */
export class UseHigherAttackingStatAttr extends VariableMoveCategoryAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move, category: NumberHolder): boolean {
    let returnVal = false;
    if (
      user.getEffectiveStat(Stat.ATK, { opponent: target, move, abilityApplyMode: AbilityApplyMode.IGNORE })
      > user.getEffectiveStat(Stat.SPATK, { opponent: target, move, abilityApplyMode: AbilityApplyMode.IGNORE })
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
