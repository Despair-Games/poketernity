import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";

/**
 * Queues a {@linkcode PostTurnStatusEffectPhase} for every active pokemon that needs one
 */
export class CheckStatusEffectPhase extends Phase {
  public override readonly phaseName = "CheckStatusEffectPhase";

  public override start(): void {
    super.start();

    /** @todo Shuffle this before sorting to resolve speed ties */
    const pokemon = globalScene
      .getField(true)
      .sort((a, b) => b.getEffectiveStat(Stat.SPD) - a.getEffectiveStat(Stat.SPD));

    pokemon.forEach((p) => {
      if (p != null && p.hasStatusEffect([StatusEffect.BURN, StatusEffect.POISON, StatusEffect.TOXIC], false, true)) {
        globalScene.phaseManager.createAndUnshiftPhase("PostTurnStatusEffectPhase", p.getBattlerIndex());
      }
    });

    this.end();
  }
}
