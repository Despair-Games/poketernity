import { FireSpinTag } from "#app/data/battler-tags/fire-spin-tag";
import type { Pokemon } from "#app/field/pokemon";
import { TRAPPED_BATTLER_TAG_TYPES } from "#app/constants/battler-tag-constants";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";

/**
 * Used for G-Max Centiferno that leaves a fire spin
 * that persists even on the user leaving the field
 * @extends FireSpinTag
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
    return !pokemon.getTag(...TRAPPED_BATTLER_TAG_TYPES);
  }
}
