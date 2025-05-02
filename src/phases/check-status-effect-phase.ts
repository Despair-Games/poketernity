import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { PostTurnStatusEffectPhase } from "#app/phases/post-turn-status-effect-phase";
import { isNil } from "#app/utils/common-utils";
import { PhaseId } from "#enums/phase-id";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";

/**
 * Queues a {@linkcode PostTurnStatusEffectPhase} for every active pokemon that needs one
 * @extends Phase
 */
export class CheckStatusEffectPhase extends Phase {
  override readonly id = PhaseId.CHECK_STATUS_EFFECT;

  public override start(): void {
    super.start();

    /** @todo Shuffle this before sorting to resolve speed ties */
    const pokemon = globalScene
      .getField(true)
      .sort((a, b) => b.getEffectiveStat(Stat.SPD) - a.getEffectiveStat(Stat.SPD));

    pokemon.forEach((p) => {
      if (!isNil(p) && p.hasStatusEffect([StatusEffect.BURN, StatusEffect.POISON, StatusEffect.TOXIC], false, true)) {
        globalScene.phaseManager.unshiftPhase(new PostTurnStatusEffectPhase(p.getBattlerIndex()));
      }
    });

    this.end();
  }
}
