import { globalScene } from "#app/global-scene";
import { ArenaTag } from "#arena-tags/arena-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import type { NumberHolder } from "#utils/common-utils";
import i18next from "i18next";

/**
 * Arena Tag implementing the "rainbow" effect from the combination
 * of {@link https://bulbapedia.bulbagarden.net/wiki/Water_Pledge_(move) | Water Pledge}
 * and {@link https://bulbapedia.bulbagarden.net/wiki/Fire_Pledge_(move) | Fire Pledge}.
 * Doubles the secondary effect chance of moves from Pokemon on the
 * given side of the field for 4 turns.
 * @extends ArenaTag
 */
export class WaterFirePledgeTag extends ArenaTag {
  constructor(sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.WATER_FIRE_PLEDGE, 4, MoveId.WATER_PLEDGE, sourceId, side);
  }

  override onAdd(_arena: Arena): void {
    // "A rainbow appeared in the sky on your/the opposing team's side!"
    globalScene.phaseManager.queueMessagePhase(i18next.t(`arenaTag:waterFirePledgeOnAdd${this.i18nSideKey}`));
  }

  /**
   * Doubles the chance for the given move's secondary effect(s) to trigger
   * @param _arena the {@linkcode Arena} containing this tag
   * @param _simulated n/a
   * @param moveChance a {@linkcode NumberHolder} containing
   * the move's current effect chance
   * @returns `true` if the move's effect chance was doubled (currently always `true`)
   */
  override apply(_arena: Arena, _simulated: boolean, moveChance: NumberHolder): boolean {
    moveChance.value *= 2;
    return true;
  }
}
