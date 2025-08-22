import { globalScene } from "#app/global-scene";
import { WeakenMoveScreenTag } from "#arena-tags/weaken-move-screen-tag";
import type { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveCategory } from "#enums/move-category";
import { MoveId } from "#enums/move-id";
import i18next from "i18next";

/**
 * Reduces the damage of physical moves.
 * Used by {@linkcode MoveId.REFLECT}
 */
export class ReflectTag extends WeakenMoveScreenTag {
  public override readonly tagType = ArenaTagType.REFLECT;

  protected override get weakenedCategories(): [typeof MoveCategory.PHYSICAL] {
    return [MoveCategory.PHYSICAL];
  }

  constructor(turnCount: number, sourceId: number | undefined, side: ArenaTagSide) {
    super(turnCount, MoveId.REFLECT, sourceId, side);
  }

  override onAdd(quiet: boolean = false): void {
    if (!quiet) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "MessagePhase",
        i18next.t(`arenaTag:reflectOnAdd${this.i18nSideKey}`),
      );
    }
  }
}
