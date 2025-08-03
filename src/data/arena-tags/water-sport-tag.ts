import { globalScene } from "#app/global-scene";
import { WeakenMoveTypeTag } from "#arena-tags/weaken-move-type-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Water_Sport_(move) Water Sport}.
 * Weakens Fire type moves for a set amount of turns, usually 5.
 */
export class WaterSportTag extends WeakenMoveTypeTag {
  constructor(turnCount: number, sourceId: number) {
    super(ArenaTagType.WATER_SPORT, turnCount, ElementalType.FIRE, MoveId.WATER_SPORT, sourceId);
  }

  override onAdd(): void {
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", i18next.t("arenaTag:waterSportOnAdd"));
  }

  override onRemove(): void {
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", i18next.t("arenaTag:waterSportOnRemove"));
  }
}
