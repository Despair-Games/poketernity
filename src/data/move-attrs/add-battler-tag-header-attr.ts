import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#app/field/pokemon";
import type { Move } from "#app/data/move";
import { MoveHeaderAttr } from "#app/data/move-attrs/move-header-attr";

/**
 * Header attribute to add a battler tag to the user at the beginning of a turn.
 * @see {@linkcode MoveHeaderAttr}
 */

export class AddBattlerTagHeaderAttr extends MoveHeaderAttr {
  private tagType: BattlerTagType;

  constructor(tagType: BattlerTagType) {
    super();
    this.tagType = tagType;
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    user.addTag(this.tagType);
    return true;
  }
}
