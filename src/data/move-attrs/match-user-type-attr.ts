import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeAttr } from "#app/data/move-attrs/variable-move-type-attr";

export class MatchUserTypeAttr extends VariableMoveTypeAttr {
  override apply(user: Pokemon, _target: Pokemon, _move: Move, args: any[]): boolean {
    const moveType = args[0];
    if (!(moveType instanceof NumberHolder)) {
      return false;
    }
    const userTypes = user.getTypes(true);

    if (userTypes.includes(Type.STELLAR)) {
      // will not change to stellar type
      const nonTeraTypes = user.getTypes();
      moveType.value = nonTeraTypes[0];
      return true;
    } else if (userTypes.length > 0) {
      moveType.value = userTypes[0];
      return true;
    } else {
      return false;
    }
  }
}
