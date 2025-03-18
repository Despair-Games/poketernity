import { SandTombTag } from "#app/data/battler-tags/sand-tomb-tag";
import type { Pokemon } from "#app/field/pokemon";
import { TrappedBattlerTagTypes } from "#app/utils/battler-tag-type-utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";

/**
 * Used for G-Max Sandblast that leaves a sand tomb
 * that persists even on the user leaving the field
 * @extends SandTombTag
 */
export class GMaxSandTombTag extends SandTombTag {
  constructor(turnCount: number, sourceId: number) {
    super(turnCount, sourceId);
    this.tagType = BattlerTagType.G_MAX_SAND_TOMB;
    this.sourceMoveId = MoveId.G_MAX_SANDBLAST;
  }

  override isSourceLinked(): boolean {
    return false;
  }

  override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.getTag(...TrappedBattlerTagTypes);
  }
}
