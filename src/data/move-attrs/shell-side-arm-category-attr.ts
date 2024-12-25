import { MoveCategory } from "#enums/move-category";
import { MoveFlags } from "#enums/move-flags";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveCategoryAttr } from "#app/data/move-attrs/variable-move-category-attr";

/**
 * Attribute used for shell side arm that makes the move physical (and makes contact)
 * if it would deal more damage as a physical attack
 */
export class ShellSideArmCategoryAttr extends VariableMoveCategoryAttr {
  /**
   * @param user - The Pokemon using shell side arm
   * @param target - The Pokemon being attacked
   * @param move - Shell side arm
   * @param args - args[0] a {@linkcode NumberHolder} thhat represents {@linkcode MoveCategory}
   * @returns true if the move should be physical
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const category = args[0] as NumberHolder;

    const predictedPhysDmg = target.getBaseDamage(user, move, MoveCategory.PHYSICAL, true, true);
    const predictedSpecDmg = target.getBaseDamage(user, move, MoveCategory.SPECIAL, true, true);

    // Random chance of being physical or special if predicted damage is tied
    if (predictedPhysDmg > predictedSpecDmg || (predictedPhysDmg === predictedSpecDmg && user.randSeedInt(2) === 0)) {
      category.value = MoveCategory.PHYSICAL;
      move.makesContact();
      return true;
    }

    /** MoveFlags are not reset every turn so if this flag is set it needs to be reset if the move is a special attack
     * Need the if check for unit tests
     */
    if (move.hasFlag(MoveFlags.MAKES_CONTACT)) {
      move.makesContact(false);
    }
    return false;
  }
}
