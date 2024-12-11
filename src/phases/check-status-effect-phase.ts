import { PostTurnStatusEffectPhase } from "#app/phases/post-turn-status-effect-phase";
import { Phase } from "#app/phase";
import type { BattlerIndex } from "#app/battle";
import { globalScene } from "#app/global-scene";
import { phaseManager } from "#app/global-phase-manager";

export class CheckStatusEffectPhase extends Phase {
  private order: BattlerIndex[];
  constructor(order: BattlerIndex[]) {
    super();
    this.order = order;
  }

  override start() {
    const field = globalScene.getField();
    for (const o of this.order) {
      if (field[o].status && field[o].status.isPostTurn()) {
        phaseManager.unshiftPhase(new PostTurnStatusEffectPhase(o));
      }
    }
    this.end();
  }
}
