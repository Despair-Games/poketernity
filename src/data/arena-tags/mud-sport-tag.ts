import { globalScene } from "#app/global-scene";
import { WeakenMoveTypeTag } from "#arena-tags/weaken-move-type-tag";
import { ArenaTagType } from "#enums/arena-tag-type";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Mud_Sport_(move) Mud Sport}.
 * Weakens Electric type moves for a set amount of turns, usually 5.
 * @extends WeakenMoveTypeTag
 */
export class MudSportTag extends WeakenMoveTypeTag {
  constructor(turnCount: number, sourceId: number) {
    super(ArenaTagType.MUD_SPORT, turnCount, ElementalType.ELECTRIC, MoveId.MUD_SPORT, sourceId);
  }

  override onAdd(_arena: Arena): void {
    globalScene.phaseManager.queueMessagePhase(i18next.t("arenaTag:mudSportOnAdd"));
  }

  override onRemove(_arena: Arena): void {
    globalScene.phaseManager.queueMessagePhase(i18next.t("arenaTag:mudSportOnRemove"));
  }
}
