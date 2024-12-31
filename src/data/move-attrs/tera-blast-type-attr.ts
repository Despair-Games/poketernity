import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

/**
 * Changes the type of Tera Blast to match the user's tera type
 * @extends VariableMoveTypeAttr
 */
export class TeraBlastTypeAttr extends VariableMoveTypeAttr {
  /** Changes the given move's type to match the user's tera type */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, moveType: NumberHolder): boolean {
    if (user.isTerastallized()) {
      moveType.value = user.getTeraType();
      return true;
    }

    return false;
  }
}
