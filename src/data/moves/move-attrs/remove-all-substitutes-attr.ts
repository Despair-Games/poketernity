import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import { inSpeedOrder } from "#utils/speed-order-generator";

/**
 * Attribute to remove all Substitutes from the field.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Tidy_Up_(move) | Tidy Up}
 * @see {@linkcode SubstituteTag}
 */
export class RemoveAllSubstitutesAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    for (const pokemon of inSpeedOrder()) {
      pokemon.findAndRemoveTags((tag) => tag.tagType === BattlerTagType.SUBSTITUTE);
    }
    return true;
  }
}
