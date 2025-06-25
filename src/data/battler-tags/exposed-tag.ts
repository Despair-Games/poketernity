// -- start tsdoc imports --
/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { EXPOSED_TAG_TYPES } from "#constants/battler-tag-constants";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */
// -- end tsdoc imports --

import { BattlerTag } from "#battler-tags/battler-tag";
import { BattlerTagLapseType } from "#enums/battler-tag-lapse-type";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";

/**
 * Tag that makes the target drop all of its type immunities
 * and all accuracy checks ignore its evasiveness stat.
 *
 * Applied by the following moves:
 * - {@linkcode MoveId.ODOR_SLEUTH | Odor Sleuth}
 * - {@linkcode MoveId.MIRACLE_EYE | Miracle Eye}
 * - {@linkcode MoveId.FORESIGHT | Foresight}
 *
 * @see {@linkcode ignoreImmunity}
 * @privateRemarks
 * Tags that use or subclass this should be added to {@linkcode EXPOSED_TAG_TYPES}
 */
export class ExposedTag extends BattlerTag {
  private defenderType: ElementalType;
  private allowedTypes: ElementalType[];

  constructor(
    tagType: BattlerTagType,
    sourceMoveId: MoveId,
    defenderType: ElementalType,
    allowedTypes: ElementalType[],
  ) {
    super(tagType, BattlerTagLapseType.CUSTOM, 1, sourceMoveId);
    this.defenderType = defenderType;
    this.allowedTypes = allowedTypes;
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.defenderType = source.defenderType as ElementalType;
    this.allowedTypes = source.allowedTypes as ElementalType[];
  }

  /**
   * @param types {@linkcode ElementalType} of the defending Pokemon
   * @param moveType {@linkcode ElementalType} of the move targetting it
   * @returns `true` if the move should be allowed to target the defender.
   */
  public ignoreImmunity(type: ElementalType, moveType: ElementalType): boolean {
    return type === this.defenderType && this.allowedTypes.includes(moveType);
  }
}
