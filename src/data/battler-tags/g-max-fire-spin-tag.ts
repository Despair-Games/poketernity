import { FireSpinTag } from "#battler-tags/fire-spin-tag";
import { TRAPPED_BATTLER_TAG_TYPES } from "#constants/battler-tag-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";

/**
 * Used for G-Max Centiferno that leaves a fire spin
 * that persists even on the user leaving the field
 */
export class GMaxFireSpinTag extends FireSpinTag {
  constructor(turnCount: number, sourceId: number) {
    super(turnCount, sourceId);
    this.tagType = BattlerTagType.G_MAX_FIRE_SPIN;
    this.sourceMoveId = MoveId.G_MAX_CENTIFERNO;
  }

  override isSourceLinked(): boolean {
    return false;
  }

  override canAdd(pokemon: Pokemon): boolean {
    return !pokemon.hasTag(...TRAPPED_BATTLER_TAG_TYPES);
  }
}
