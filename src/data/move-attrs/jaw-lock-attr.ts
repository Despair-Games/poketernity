import type { Pokemon } from "#app/field/pokemon";
import { TrappedBattlerTagTypes } from "#app/utils/battler-tag-type-utils";
import { BattlerTagType } from "#enums/battler-tag-type";
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

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    // If either the user or the target already has the tag, do not apply
    if (user.getTag(...TrappedBattlerTagTypes) || target.getTag(...TrappedBattlerTagTypes)) {
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
