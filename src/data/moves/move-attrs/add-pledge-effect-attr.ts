import type { ArenaTagRelativeSide } from "#enums/arena-tag-relative-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { AddArenaTagAttr } from "#moves/add-arena-tag-attr";
import type { Move } from "#moves/move";

/**
 * Attribute that adds a secondary effect to the field when two unique Pledge moves
 * are combined. The effect added varies based on the two Pledge moves combined.
 */
export class AddPledgeEffectAttr extends AddArenaTagAttr {
  private readonly requiredPledge: MoveId;

  constructor(tagType: ArenaTagType, requiredPledge: MoveId, relativeSide: ArenaTagRelativeSide) {
    super(tagType, relativeSide, {
      turnCount: 4,
      failOnOverlap: false,
    });

    this.requiredPledge = requiredPledge;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (user.turnData.combiningPledge === this.requiredPledge) {
      return super.apply(user, target, move);
    }
    return false;
  }
}
