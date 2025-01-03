import type { Pokemon } from "#app/field/pokemon";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { Moves } from "#enums/moves";
import type { Move } from "../move";
import { AddArenaTagAttr } from "./add-arena-tag-attr";

/**
 * Attribute that adds a secondary effect to the field when two unique Pledge moves
 * are combined. The effect added varies based on the two Pledge moves combined.
 * @extends AddArenaTagAttr
 */
export class AddPledgeEffectAttr extends AddArenaTagAttr {
  private readonly requiredPledge: Moves;

  constructor(tagType: ArenaTagType, requiredPledge: Moves, selfSideTarget: boolean = false) {
    super(tagType, 4, false, selfSideTarget);

    this.requiredPledge = requiredPledge;
  }

  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    if (user.turnData.combiningPledge === this.requiredPledge) {
      return super.apply(user, target, move);
    }
    return false;
  }
}
