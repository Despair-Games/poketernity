import type { Pokemon } from "#app/field/pokemon";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Move } from "../move";
import { MoveEffectAttr } from "./move-effect-attr";

/**
 * Attribute to lapse battler tags of a given type set on the target.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Mortal_Spin_(move) Mortal Spin}.
 * @extends MoveEffectAttr
 */
export class LapseBattlerTagAttr extends MoveEffectAttr {
  public tagTypes: BattlerTagType[];

  constructor(tagTypes: BattlerTagType[], selfTarget: boolean = false) {
    super(selfTarget);

    this.tagTypes = tagTypes;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.apply(user, target, move)) {
      return false;
    }

    for (const tagType of this.tagTypes) {
      (this.selfTarget ? user : target).lapseTag(tagType);
    }

    return true;
  }
}
