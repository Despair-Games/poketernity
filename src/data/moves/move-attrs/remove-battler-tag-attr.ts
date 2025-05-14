import { BattlerTagType } from "#enums/battler-tag-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

export const rapidSpinRemoveTags = [
  BattlerTagType.BIND,
  BattlerTagType.WRAP,
  BattlerTagType.FIRE_SPIN,
  BattlerTagType.G_MAX_FIRE_SPIN,
  BattlerTagType.WHIRLPOOL,
  BattlerTagType.CLAMP,
  BattlerTagType.SAND_TOMB,
  BattlerTagType.G_MAX_SAND_TOMB,
  BattlerTagType.MAGMA_STORM,
  BattlerTagType.SNAP_TRAP,
  BattlerTagType.THUNDER_CAGE,
  BattlerTagType.SEEDED,
  BattlerTagType.INFESTATION,
];

/**
 * Attribute to remove battler tags within a given type set from the target.
 * @extends MoveEffectAttr
 */
export class RemoveBattlerTagAttr extends MoveEffectAttr {
  public tagTypes: BattlerTagType[];

  constructor(tagTypes: BattlerTagType[], selfTarget: boolean = false) {
    super(selfTarget);

    this.tagTypes = tagTypes;
  }

  override applyEffect(user: Pokemon, target: Pokemon, _move: Move): boolean {
    for (const tagType of this.tagTypes) {
      (this.selfTarget ? user : target).removeTag(tagType);
    }

    return true;
  }
}
