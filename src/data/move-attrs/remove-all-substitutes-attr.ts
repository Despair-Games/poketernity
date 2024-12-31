import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";

/**
 * Attribute to remove all Substitutes from the field.
 * @extends MoveEffectAttr
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Tidy_Up_(move) | Tidy Up}
 * @see {@linkcode SubstituteTag}
 */
export class RemoveAllSubstitutesAttr extends MoveEffectAttr {
  constructor() {
    super(true);
  }

  /** Removes the Substitute Doll effect from all active Pokemon on the field */
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    globalScene
      .getField(true)
      .forEach((pokemon) => pokemon.findAndRemoveTags((tag) => tag.tagType === BattlerTagType.SUBSTITUTE));
    return true;
  }
}
