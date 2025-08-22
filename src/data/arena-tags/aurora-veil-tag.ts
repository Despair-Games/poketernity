import { globalScene } from "#app/global-scene";
import { WeakenMoveScreenTag } from "#arena-tags/weaken-move-screen-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveCategory } from "#enums/move-category";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Reduces the damage of physical and special moves.
 * Used by {@linkcode MoveId.AURORA_VEIL}.
 */
export class AuroraVeilTag extends WeakenMoveScreenTag {
  public override readonly tagType = ArenaTagType.AURORA_VEIL;

  protected get weakenedCategories(): [typeof MoveCategory.PHYSICAL, typeof MoveCategory.SPECIAL] {
    return [MoveCategory.PHYSICAL, MoveCategory.SPECIAL];
  }

  constructor(turnCount: number, sourceId: number | undefined, side: ArenaTagSide) {
    super(turnCount, MoveId.AURORA_VEIL, sourceId, side);
  }

  override onAdd(quiet: boolean = false): void {
    if (!quiet) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t(`arenaTag:auroraVeilOnAdd${this.i18nSideKey}`),
      );
    }
  }
}
