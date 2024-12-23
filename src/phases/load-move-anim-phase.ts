import { initMoveAnim, loadMoveAnimAssets } from "#app/data/battle-anims";
import { Phase } from "#app/phase";
import type { Moves } from "#enums/moves";

/**
 * Phase for synchronous move animation loading.
 * Should be used when a move invokes another move that
 * isn't already loaded (e.g. for Metronome).
 *
 * @extends Phase
 */
export class LoadMoveAnimPhase extends Phase {
  constructor(protected readonly moveId: Moves) {
    super();
  }

  public override start(): void {
    initMoveAnim(this.moveId)
      .then(() => loadMoveAnimAssets([this.moveId], true))
      .then(() => this.end());
  }
}
