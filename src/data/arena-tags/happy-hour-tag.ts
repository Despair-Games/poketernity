import { globalScene } from "#app/global-scene";
import { ArenaTag } from "#arena-tags/arena-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Happy_Hour_(move) Happy Hour}.
 * Doubles the prize money from trainers and money moves like {@linkcode MoveId.PAY_DAY} and {@linkcode MoveId.MAKE_IT_RAIN}.
 * @extends ArenaTag
 */
export class HappyHourTag extends ArenaTag {
  constructor(sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.HAPPY_HOUR, 0, MoveId.HAPPY_HOUR, sourceId, side);
  }

  override onAdd(_arena: Arena): void {
    globalScene.phaseManager.queueMessagePhase(i18next.t("arenaTag:happyHourOnAdd"));
  }

  override onRemove(_arena: Arena): void {
    globalScene.phaseManager.queueMessagePhase(i18next.t("arenaTag:happyHourOnRemove"));
  }
}
