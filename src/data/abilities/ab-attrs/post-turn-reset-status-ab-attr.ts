import { getStatusEffectHealText } from "#app/data/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PostTurnAbAttr } from "./post-turn-ab-attr";

/**
 * After the turn ends, resets the status of either the ability holder or their ally
 * @param allyTarget - Whether to target ally, defaults to `false` (self-target)
 * @extends PostTurnAbAttr
 */
export class PostTurnResetStatusAbAttr extends PostTurnAbAttr {
  private readonly allyTarget: boolean;
  private target?: Pokemon;

  constructor(allyTarget: boolean = false) {
    super(true);
    this.allyTarget = allyTarget;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (this.allyTarget) {
      this.target = pokemon.getAlly();
    } else {
      this.target = pokemon;
    }
    if (this.target?.hasNonVolatileStatusEffect(false, true)) {
      if (!simulated) {
        globalScene.queueMessage(
          getStatusEffectHealText(this.target.getStatusEffect(true), getPokemonNameWithAffix(this.target)),
        );
        this.target.resetStatus();
        this.target.updateInfo();
      }

      return true;
    }

    return false;
  }
}
