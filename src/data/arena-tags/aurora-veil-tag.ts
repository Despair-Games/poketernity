import { globalScene } from "#app/global-scene";
import { WeakenMoveScreenTag } from "#arena-tags/weaken-move-screen-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveCategory } from "#enums/move-category";
import { MoveId } from "#enums/move-id";
import type { Arena } from "#field/arena";
import i18next from "i18next";

/**
 * Reduces the damage of physical and special moves.
 * Used by {@linkcode MoveId.AURORA_VEIL}.
 * @extends WeakenMoveScreenTag
 */
export class AuroraVeilTag extends WeakenMoveScreenTag {
  constructor(turnCount: number, sourceId: number, side: ArenaTagSide) {
    super(ArenaTagType.AURORA_VEIL, turnCount, MoveId.AURORA_VEIL, sourceId, side, [
      MoveCategory.SPECIAL,
      MoveCategory.PHYSICAL,
    ]);
  }

  override onAdd(_arena: Arena, quiet: boolean = false): void {
    if (!quiet) {
      globalScene.phaseManager.queueMessagePhase(i18next.t(`arenaTag:auroraVeilOnAdd${this.i18nSideKey}`));
    }
  }
}
