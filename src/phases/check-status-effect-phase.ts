import type { BattlerIndex } from "#app/battle";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { PostTurnStatusEffectPhase } from "#app/phases/post-turn-status-effect-phase";
import { isNullOrUndefined } from "#app/utils";

/**
 * Queues a {@linkcode PostTurnStatusEffectPhase} for every active pokemon that needs one
 * @extends Phase
 */
export class CheckStatusEffectPhase extends Phase {
  /** The pokemon being checked, ordered by turn order */
  private readonly activePokemon: BattlerIndex[];

  constructor(activePokemon: BattlerIndex[]) {
    super();

    this.activePokemon = activePokemon;
  }

  public override start(): void {
    super.start();

    for (const p of this.activePokemon) {
      const pokemon = globalScene.getFieldPokemonByBattlerIndex(p);
      if (!isNullOrUndefined(pokemon) && pokemon.status && pokemon.status.isPostTurn()) {
        globalScene.unshiftPhase(new PostTurnStatusEffectPhase(p));
      }
    }
    this.end();
  }
}
