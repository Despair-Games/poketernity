import { loadMoveAnimAssets } from "#app/utils/move-anim-utils";
import { initMoveAnim } from "#app/data/init-move-anim";
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
  constructor(protected readonly moveId: MoveId) {
    super();
    this._id = PhaseId.LOAD_MOVE_ANIM;
  }

  public override start(): void {
    initMoveAnim(this.moveId)
      .then(() => loadMoveAnimAssets([this.moveId], true))
      .then(() => this.end());
  }
}
