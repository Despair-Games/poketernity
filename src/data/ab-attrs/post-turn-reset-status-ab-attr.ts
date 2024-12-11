import { getStatusEffectHealText } from "#app/data/status-effect";
import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PostTurnAbAttr } from "./post-turn-ab-attr";

/**
 * After the turn ends, resets the status of either the ability holder or their ally
 * @param allyTarget Whether to target ally, defaults to `false` (self-target)
 */
export class PostTurnResetStatusAbAttr extends PostTurnAbAttr {
  private allyTarget: boolean;
  private target: Pokemon;

  constructor(allyTarget: boolean = false) {
    super(true);
    this.allyTarget = allyTarget;
  }

  override applyPostTurn(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    if (this.allyTarget) {
      this.target = pokemon.getAlly();
    } else {
      this.target = pokemon;
    }
    if (this.target?.status) {
      if (!simulated) {
        globalScene.queueMessage(
          getStatusEffectHealText(this.target.status?.effect, getPokemonNameWithAffix(this.target)),
        );
        this.target.resetStatus(false);
        this.target.updateInfo();
      }

      return true;
    }

    return false;
  }
}
