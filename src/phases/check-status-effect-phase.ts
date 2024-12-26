import { PostTurnStatusEffectPhase } from "#app/phases/post-turn-status-effect-phase";
import { Phase } from "#app/phase";
import type { BattlerIndex } from "#app/battle";
import { globalScene } from "#app/global-scene";
import { isNullOrUndefined } from "#app/utils";

export class CheckStatusEffectPhase extends Phase {
  private order: BattlerIndex[];
  constructor(order: BattlerIndex[]) {
    super();
    this.order = order;
  }

  override start() {
    for (const o of this.order) {
      const pokemon = globalScene.getFieldPokemonByBattlerIndex(o);
      if (!isNullOrUndefined(pokemon) && pokemon.status && pokemon.status.isPostTurn()) {
        globalScene.unshiftPhase(new PostTurnStatusEffectPhase(o));
      }
    }
    this.end();
  }
}
