import type { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveHeaderAttr } from "#moves/move-header-attr";

/**
 * Header attribute to add a battler tag to the user at the beginning of a turn.
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
