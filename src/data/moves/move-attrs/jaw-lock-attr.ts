import { TRAPPED_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { TrapAttr } from "#moves/trap-attr";

/**
 * Attribute to implement Jaw Lock's linked trapping effect between the user and target
 */
export class JawLockAttr extends TrapAttr {
  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    // If either the user or the target already has the tag, do not apply
    if (user.hasTag(...TRAPPED_BATTLER_TAG_TYPES) || target.hasTag(...TRAPPED_BATTLER_TAG_TYPES)) {
      return false;
    }

    /**
     * Add the tag to both the user and the target.
     * The target's tag source is considered to be the user and vice versa
     */
    return (
      target.addTag(BattlerTagType.TRAPPED, 1, move.id, user.id)
      && user.addTag(BattlerTagType.TRAPPED, 1, move.id, target.id)
    );
  }
}
