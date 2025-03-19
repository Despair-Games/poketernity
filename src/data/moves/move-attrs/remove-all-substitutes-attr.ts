import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/moves/move";
import { MoveEffectAttr } from "#app/data/moves/move-attrs/move-effect-attr";

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

  override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    globalScene
      .getField(true)
      .forEach((pokemon) => pokemon.findAndRemoveTags((tag) => tag.tagType === BattlerTagType.SUBSTITUTE));
    return true;
  }
}
