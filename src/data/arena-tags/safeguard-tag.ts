import { globalScene } from "#app/global-scene";
import { ArenaTag } from "#arena-tags/arena-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import i18next from "i18next";

/**
 * Prevents Pokemon on the tag's {@linkcode ArenaTagSide | side}
 * from being afflicted with non-volatile status conditions
 * and Confusion.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Safeguard_(move) | Safeguard}
 */
export class SafeguardTag extends ArenaTag {
  constructor(turnCount: number, sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.SAFEGUARD, turnCount, MoveId.SAFEGUARD, sourceId, side);
  }

  override onAdd(_arena: Arena): void {
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t(`arenaTag:safeguardOnAdd${this.i18nSideKey}`),
    );
  }

  override onRemove(_arena: Arena): void {
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t(`arenaTag:safeguardOnRemove${this.i18nSideKey}`),
    );
  }
}
