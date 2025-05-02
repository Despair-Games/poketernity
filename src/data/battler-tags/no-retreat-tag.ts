import { TrappedTag } from "#app/data/battler-tags/trapped-tag";
import type { Pokemon } from "#app/field/pokemon";
import { TrappedBattlerTagTypes } from "#app/utils/battler-tag-type-utils";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";

/**
 * BattlerTag implementing No Retreat's trapping effect.
 * This is treated separately from other trapping effects to prevent
 * Ghost-type Pokemon from being able to reuse the move.
 * @extends TrappedTag
 */
export class NoRetreatTag extends TrappedTag {
  constructor(sourceId: number) {
    super(BattlerTagType.NO_RETREAT, BattlerTagLapseType.CUSTOM, 0, MoveId.NO_RETREAT, sourceId);
  }

  /** overrides {@linkcode TrappedTag.apply}, removing the Ghost-type condition */
  override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.getTag(...TrappedBattlerTagTypes);
  }
}
