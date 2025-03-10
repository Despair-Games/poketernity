import { loadMoveAnimAssets } from "#app/utils/move-anim-utils";
import { initMoveAnim } from "#app/data/init/init-move-anim";
import { Phase } from "#app/phase";
import type { MoveId } from "#enums/move-id";
import { PhaseId } from "#enums/phase-id";

/**
 * Phase for synchronous move animation loading.
 * Should be used when a move invokes another move that
 * isn't already loaded (e.g. for Metronome).
 *
 * @extends Phase
 */
export class LoadMoveAnimPhase extends Phase {
  override readonly id = PhaseId.LOAD_MOVE_ANIM;

  protected readonly moveId: MoveId;

  constructor(moveId: MoveId) {
    super();

    this.moveId = moveId;
  }

  public override start(): void {
    initMoveAnim(this.moveId)
      .then(() => loadMoveAnimAssets([this.moveId], true))
      .then(() => this.end());
  }
}
