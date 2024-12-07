import type { BattlerIndex } from "#app/battle";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { PostTurnStatusEffectPhase } from "#app/phases/post-turn-status-effect-phase";

/** Queues a {@linkcode PostTurnStatusEffectPhase} for every active pokemon that needs one */
export class CheckStatusEffectPhase extends Phase {
  /** The pokemon being checked, ordered by turn order */
  private activePokemon: BattlerIndex[];

  constructor(activePokemon: BattlerIndex[]) {
    super();

    this.activePokemon = activePokemon;
  }

  public override start(): void {
    super.start();

    const field = globalScene.getField();
    for (const p of this.activePokemon) {
      if (field[p].status && field[p].status.isPostTurn()) {
        globalScene.unshiftPhase(new PostTurnStatusEffectPhase(p));
      }
    }
    this.end();
  }
}
