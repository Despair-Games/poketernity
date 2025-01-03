import { BattlerTagType } from "#enums/battler-tag-type";
import { Type } from "#enums/type";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import type { Move } from "#app/data/move";
import { VariableMoveTypeMultiplierAttr } from "#app/data/move-attrs/variable-move-type-multiplier-attr";

/**
 * Attribute to set a move's type effectiveness to 1 against
 * Flying-type Pokemon that are not grounded by an effect.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Thousand_Arrows_(move) Thousand Arrows}.
 * @extends VariableMoveTypeMultiplierAttr
 */
export class NeutralDamageAgainstFlyingTypeMultiplierAttr extends VariableMoveTypeMultiplierAttr {
  /**
   * If the target is Flying-type and is not grounded by another effect,
   * sets the given move's type effectiveness multiplier to 1.
   */
  override apply(_user: Pokemon, target: Pokemon, _move: Move, multiplier: NumberHolder): boolean {
    if (!target.getTag(BattlerTagType.IGNORE_FLYING)) {
      //When a flying type is hit, the first hit is always 1x multiplier.
      if (target.isOfType(Type.FLYING)) {
        multiplier.value = 1;
      }
      return true;
    }

    return false;
  }
}
