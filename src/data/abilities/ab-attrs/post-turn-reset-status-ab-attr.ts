import { PostTurnAbAttr } from "#abilities/post-turn-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import { getStatusEffectHealText } from "#utils/status-effect-utils";

/**
 * After the turn ends, resets the status of either the ability holder or their ally
 * @param allyTarget - (Default `false`) Whether to target the Pokemon's ally
 */
export class PostTurnResetStatusAbAttr extends PostTurnAbAttr {
  private readonly allyTarget: boolean;

  constructor(allyTarget: boolean = false) {
    super();
    this.allyTarget = allyTarget;
  }

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    const target = this.allyTarget ? pokemon.getAlly() : pokemon;
    if (simulated || target == null) {
      return;
    }

    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      getStatusEffectHealText(target.getStatusEffect(true), getPokemonNameWithAffix(target)),
    );
    target.resetStatus();
    target.updateInfo();
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    const target = this.allyTarget ? pokemon.getAlly() : pokemon;
    return !!target?.isActive(true) && target.hasNonVolatileStatusEffect(false, true);
  }
}
