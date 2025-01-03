import { MoveCategory } from "#enums/move-category";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveCategoryAttr } from "#app/data/move-attrs/variable-move-category-attr";

/**
 * Attribute to change move category to match the user's highest effective offensive stat.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Photon_Geyser_(move) Photon Geyser}.
 * @extends VariableMoveCategoryAttr
 */
export class PhotonGeyserCategoryAttr extends VariableMoveCategoryAttr {
  /** Changes the given move's category to match the user's highest effective offensive stat */
  override apply(user: Pokemon, target: Pokemon, move: Move, category: NumberHolder): boolean {
    if (user.getEffectiveStat(Stat.ATK, target, move) > user.getEffectiveStat(Stat.SPATK, target, move)) {
      category.value = MoveCategory.PHYSICAL;
      return true;
    }

    return false;
  }
}
