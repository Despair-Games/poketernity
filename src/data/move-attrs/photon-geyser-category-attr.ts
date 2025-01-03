import { MoveCategory } from "#enums/move-category";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveCategoryAttr } from "#app/data/move-attrs/variable-move-category-attr";

export class PhotonGeyserCategoryAttr extends VariableMoveCategoryAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move, args: any[]): boolean {
    const category = args[0] as NumberHolder;

    if (user.getEffectiveStat(Stat.ATK, target, move, true) > user.getEffectiveStat(Stat.SPATK, target, move, true)) {
      category.value = MoveCategory.PHYSICAL;
      return true;
    }

    return false;
  }
}
