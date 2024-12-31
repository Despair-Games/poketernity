import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableAccuracyAttr } from "#app/data/move-attrs/variable-accuracy-attr";

export class ToxicAccuracyAttr extends VariableAccuracyAttr {
  /** Changes accuracy to guarantee a hit if the user is Poison-type */
  override apply(user: Pokemon, _target: Pokemon, _move: Move, accuracy: NumberHolder): boolean {
    if (user.isOfType(Type.POISON)) {
      accuracy.value = -1;
      return true;
    }

    return false;
  }
}
