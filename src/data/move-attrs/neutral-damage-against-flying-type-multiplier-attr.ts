import { BattlerTagType } from "#enums/battler-tag-type";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeMultiplierAttr } from "#app/data/move-attrs/variable-move-type-multiplier-attr";

export class NeutralDamageAgainstFlyingTypeMultiplierAttr extends VariableMoveTypeMultiplierAttr {
  override apply(_user: Pokemon, target: Pokemon, _move: Move, args: any[]): boolean {
    if (!target.getTag(BattlerTagType.IGNORE_FLYING)) {
      const multiplier = args[0] as NumberHolder;
      //When a flying type is hit, the first hit is always 1x multiplier.
      if (target.isOfType(Type.FLYING)) {
        multiplier.value = 1;
      }
      return true;
    }

    return false;
  }
}
