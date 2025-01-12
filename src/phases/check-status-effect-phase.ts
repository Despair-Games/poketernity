import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { PostTurnStatusEffectPhase } from "#app/phases/post-turn-status-effect-phase";
import { isNullOrUndefined } from "#app/utils";
import { Stat } from "#enums/stat";

/**
 * Queues a {@linkcode PostTurnStatusEffectPhase} for every active pokemon that needs one
 * @extends Phase
 */
export class CheckStatusEffectPhase extends Phase {
  public override start(): void {
    super.start();

    // TODO: shuffle this before sorting to randomize Speed ties
    const pokemon = globalScene
      .getField(true)
      .sort((a, b) => b.getEffectiveStat(Stat.SPD) - a.getEffectiveStat(Stat.SPD));

    pokemon.forEach((p) => {
      if (!isNullOrUndefined(p) && p.status && p.status.isPostTurn()) {
        globalScene.unshiftPhase(new PostTurnStatusEffectPhase(p.getBattlerIndex()));
      }
    });

    this.end();
  }
}
