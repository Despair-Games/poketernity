import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import { globalScene } from "#app/global-scene";
import { SerializableArenaTag } from "#arena-tags/arena-tag";
import { SCREEN_DOUBLES_DMG_FACTOR, SCREEN_SINGLES_DMG_FACTOR } from "#constants/game-constants";
import type { MoveCategory } from "#enums/move-category";
import type { Pokemon } from "#field/pokemon";
import type { ArenaScreenTagType } from "#types/arena-tag-types";
import { ValueHolder } from "#utils/common-utils";

/** Reduces the damage of specific move categories in the arena. */
export abstract class WeakenMoveScreenTag extends SerializableArenaTag {
  public abstract override readonly tagType: ArenaScreenTagType;

  // Getter to avoid unnecessary serialization and prevent modification
  protected abstract get weakenedCategories(): MoveCategory[];

  /**
   * Applies the weakening effect to the move.
   * @param simulated - Whether to suppress changes to the game state
   * @param attacker - The attacking {@linkcode Pokemon}
   * @param moveCategory - The attacking move's {@linkcode MoveCategory}.
   * @param damageMultiplier - A {@linkcode ValueHolder} containing the damage multiplier
   * @returns Whether the attacking move was weakened
   */
  public override apply(
    simulated: boolean,
    attacker: Pokemon,
    moveCategory: MoveCategory,
    damageMultiplier: ValueHolder<number>,
  ): boolean {
    if (!this.weakenedCategories.includes(moveCategory)) {
      return false;
    }

    const bypassed = new ValueHolder(false);
    applyAbAttrs("InfiltratorAbAttr", { pokemon: attacker, simulated, bypassed });
    if (bypassed.value) {
      return false;
    }

    damageMultiplier.value = globalScene.currentBattle.double ? SCREEN_DOUBLES_DMG_FACTOR : SCREEN_SINGLES_DMG_FACTOR;
    return true;
  }
}
