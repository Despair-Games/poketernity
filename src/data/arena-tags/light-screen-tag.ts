import { globalScene } from "#app/global-scene";
import { WeakenMoveScreenTag } from "#arena-tags/weaken-move-screen-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveCategory } from "#enums/move-category";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Reduces the damage of special moves.
 * Used by {@linkcode MoveId.LIGHT_SCREEN}
 */
export class LightScreenTag extends WeakenMoveScreenTag {
  constructor(turnCount: number, sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.LIGHT_SCREEN, turnCount, MoveId.LIGHT_SCREEN, sourceId, side, [MoveCategory.SPECIAL]);
  }

  override onAdd(quiet: boolean = false): void {
    if (!quiet) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t(`arenaTag:lightScreenOnAdd${this.i18nSideKey}`),
      );
    }
  }
}
