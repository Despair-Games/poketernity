import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { InfiltratorAbAttr } from "#abilities/infiltrator-ab-attr";
import { globalScene } from "#app/global-scene";
import { ArenaTag } from "#arena-tags/arena-tag";
import { SCREEN_DOUBLES_DMG_FACTOR, SCREEN_SINGLES_DMG_FACTOR } from "#constants/game-constants";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { MoveCategory } from "#enums/move-category";
import type { MoveId } from "#enums/move-id";
import type { Pokemon } from "#field/pokemon";
import { BooleanHolder, type NumberHolder } from "#utils/common-utils";

/**
 * Reduces the damage of specific move categories in the arena.
 */
export abstract class WeakenMoveScreenTag extends ArenaTag {
  protected readonly weakenedCategories: MoveCategory[];

  /**
   * Creates a new instance of the WeakenMoveScreenTag class.
   *
   * @param tagType - The type of the arena tag.
   * @param turnCount - The number of turns the tag is active.
   * @param sourceMoveId - The move that created the tag.
   * @param sourceId - The ID of the source of the tag.
   * @param side - The side (player or enemy) the tag affects.
   * @param weakenedCategories - The categories of moves that are weakened by this tag.
   */
  constructor(
    tagType: ArenaTagType,
    turnCount: number,
    sourceMoveId: MoveId,
    sourceId: number,
    side: ArenaTagSide,
    weakenedCategories: MoveCategory[],
  ) {
    super(tagType, turnCount, sourceMoveId, sourceId, side);

    this.weakenedCategories = weakenedCategories;
  }

  /**
   * Applies the weakening effect to the move.
   *
   * @param _simulated n/a
   * @param attacker the attacking {@linkcode Pokemon}
   * @param moveCategory the attacking move's {@linkcode MoveCategory}.
   * @param damageMultiplier A {@linkcode NumberHolder} containing the damage multiplier
   * @returns `true` if the attacking move was weakened; `false` otherwise.
   */
  override apply(
    simulated: boolean,
    attacker: Pokemon,
    moveCategory: MoveCategory,
    damageMultiplier: NumberHolder,
  ): boolean {
    if (this.weakenedCategories.includes(moveCategory)) {
      const bypassed = new BooleanHolder(false);
      applyAbAttrs<InfiltratorAbAttr>(AbAttrFlag.INFILTRATOR, attacker, simulated, bypassed);
      if (bypassed.value) {
        return false;
      }
      damageMultiplier.value = globalScene.currentBattle.double ? SCREEN_DOUBLES_DMG_FACTOR : SCREEN_SINGLES_DMG_FACTOR;
      return true;
    }
    return false;
  }
}
