import { SandTombTag } from "#battler-tags/sand-tomb-tag";
import { TRAPPED_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";

/**
 * Used for G-Max Sandblast that leaves a sand tomb
 * that persists even on the user leaving the field
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
    return !pokemon.hasTag(...TRAPPED_BATTLER_TAG_TYPES);
  }
}
