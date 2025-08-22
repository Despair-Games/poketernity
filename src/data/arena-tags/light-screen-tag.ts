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
  public override readonly tagType = ArenaTagType.LIGHT_SCREEN;

  protected override get weakenedCategories(): [typeof MoveCategory.SPECIAL] {
    return [MoveCategory.SPECIAL];
  }

  constructor(turnCount: number, sourceId: number | undefined, side: ArenaTagSide) {
    super(turnCount, MoveId.LIGHT_SCREEN, sourceId, side);
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
