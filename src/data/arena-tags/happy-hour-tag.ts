import { globalScene } from "#app/global-scene";
import { SerializableArenaTag } from "#arena-tags/arena-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Arena Tag class for {@link https://bulbapedia.bulbagarden.net/wiki/Happy_Hour_(move) Happy Hour}.
 *
 * Doubles the prize money from trainers and money moves like {@linkcode MoveId.PAY_DAY} and {@linkcode MoveId.MAKE_IT_RAIN}.
 */
export class HappyHourTag extends SerializableArenaTag {
  public override readonly tagType = ArenaTagType.HAPPY_HOUR;

  constructor(sourceId: number | undefined, side: ArenaTagSide) {
    super(0, MoveId.HAPPY_HOUR, sourceId, side);
  }

  override onAdd(): void {
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", i18next.t("arenaTag:happyHourOnAdd"));
  }

  override onRemove(): void {
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", i18next.t("arenaTag:happyHourOnRemove"));
  }
}
