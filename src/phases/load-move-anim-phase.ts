import { Phase } from "#app/phase";
import type { MoveId } from "#enums/move-id";
import { initMoveAnim } from "#init/init-move-anim";
import { loadMoveAnimAssets } from "#utils/move-anim-utils";

/**
 * Phase for synchronous move animation loading.
 * Should be used when a move invokes another move that
 * isn't already loaded (e.g. for Metronome).
 */
export class LoadMoveAnimPhase extends Phase {
  public override readonly phaseName = "LoadMoveAnimPhase";

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
