import type { Pokemon } from "#app/field/pokemon";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Move } from "../move";
import { MoveEffectAttr } from "./move-effect-attr";

/**
 * Attribute to remove battler tags within a given type set
 * from the target.
 * @extends MoveEffectAttr
 */
export class RemoveBattlerTagAttr extends MoveEffectAttr {
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
      (this.selfTarget ? user : target).removeTag(tagType);
    }

    return true;
  }
}
