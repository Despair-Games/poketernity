import type { BattlerIndex } from "#app/battle";
import type BattleScene from "#app/battle-scene";
import { Phase } from "#app/phase";
import { PostTurnStatusEffectPhase } from "#app/phases/post-turn-status-effect-phase";

/** Queues a {@linkcode PostTurnStatusEffectPhase} for every active pokemon that needs one */
export class CheckStatusEffectPhase extends Phase {
  /** The pokemon being checked, ordered by turn order */
  private activePokemon: BattlerIndex[];

  constructor(scene: BattleScene, activePokemon: BattlerIndex[]) {
    super(scene);

    this.activePokemon = activePokemon;
  }

  public override start(): void {
    super.start();

    const field = this.scene.getField();
    for (const p of this.activePokemon) {
      if (field[p].status && field[p].status.isPostTurn()) {
        this.scene.unshiftPhase(new PostTurnStatusEffectPhase(this.scene, p));
      }
    }
    this.end();
  }
}
