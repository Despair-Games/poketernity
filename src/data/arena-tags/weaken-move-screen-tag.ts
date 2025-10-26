import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { SerializableArenaTag } from "#arena-tags/arena-tag";
import { SCREEN_DOUBLES_DMG_FACTOR, SCREEN_SINGLES_DMG_FACTOR } from "#constants/game-constants";
import type { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#field/pokemon";
import type { ArenaScreenTagType } from "#types/arena-tag-types";
import { BooleanHolder, type NumberHolder } from "#utils/common-utils";

/**
 * Reduces the damage of specific move categories in the arena.
 */
export abstract class WeakenMoveScreenTag extends SerializableArenaTag {
  public abstract override readonly tagType: ArenaScreenTagType;

  // Getter to avoid unnecessary serialization and prevent modification
  protected abstract get weakenedCategories(): MoveCategory[];

  /**
   * Applies the weakening effect to the move.
   *
   * @param simulated n/a
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
      applyAbAttrs("InfiltratorAbAttr", attacker, simulated, bypassed);
      if (bypassed.value) {
        return false;
      }
      damageMultiplier.value = globalScene.currentBattle.double ? SCREEN_DOUBLES_DMG_FACTOR : SCREEN_SINGLES_DMG_FACTOR;
      return true;
    }
    return false;
  }
}
