import type { Pokemon } from "#app/field/pokemon";
import { BattlerTagType } from "#enums/battler-tag-type";
import { TrappedTag } from "../battler-tags";
import type { Move } from "../move";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";

/**
 * Attribute to implement Jaw Lock's linked trapping effect between the user and target
 * @extends AddBattlerTagAttr
 */
export class JawLockAttr extends AddBattlerTagAttr {
  constructor() {
    super(BattlerTagType.TRAPPED);
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (!super.canApply(user, target, move)) {
      return false;
    }

    // If either the user or the target already has the tag, do not apply
    if (user.getTag(TrappedTag) || target.getTag(TrappedTag)) {
      return false;
    }

    const moveChance = this.getMoveChance(user, target, move, this.selfTarget);
    if (moveChance < 0 || moveChance === 100 || user.randSeedInt(100) < moveChance) {
      /**
       * Add the tag to both the user and the target.
       * The target's tag source is considered to be the user and vice versa
       */
      return (
        target.addTag(BattlerTagType.TRAPPED, 1, move.id, user.id)
        && user.addTag(BattlerTagType.TRAPPED, 1, move.id, target.id)
      );
    }

    return false;
  }
}
