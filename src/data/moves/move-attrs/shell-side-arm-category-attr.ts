import { AbilityApplyMode } from "#enums/ability-apply-mode";
import { MoveCategory } from "#enums/move-category";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { VariableMoveCategoryAttr } from "#moves/variable-move-category-attr";
import type { NumberHolder } from "#utils/common-utils";

/**
 * Attribute used for shell side arm that makes the move physical (and makes contact)
 * if it would deal more damage as a physical attack.
 */
export class ShellSideArmCategoryAttr extends VariableMoveCategoryAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move, category: NumberHolder): boolean {
    const predictedPhysDmg = target.getBaseDamage(user, move, MoveCategory.PHYSICAL, AbilityApplyMode.IGNORE);
    const predictedSpecDmg = target.getBaseDamage(user, move, MoveCategory.SPECIAL, AbilityApplyMode.IGNORE);

    // Random chance of being physical or special if predicted damage is tied
    if (predictedPhysDmg > predictedSpecDmg || (predictedPhysDmg === predictedSpecDmg && user.randSeedInt(2) === 0)) {
      category.value = MoveCategory.PHYSICAL;
      move.makesContact();
      return true;
    }

    /**
     * MoveFlags are not reset every turn so if this flag is set it needs to be reset if the move is a special attack
     * Need the if check for unit tests
     */
    if (move.checkFlag(MoveFlags.MAKES_CONTACT, user, target)) {
      move.makesContact(false);
    }
    return false;
  }
}
