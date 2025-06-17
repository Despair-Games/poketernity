import { globalScene } from "#app/global-scene";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

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
    globalScene
      .getField(true)
      .forEach((pokemon) => pokemon.findAndRemoveTags((tag) => tag.tagType === BattlerTagType.SUBSTITUTE));
    return true;
  }
}
