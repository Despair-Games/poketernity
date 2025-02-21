import type { BattlerIndex } from "#enums/battler-index";
import { globalScene } from "#app/global-scene";
import { Phase } from "#app/phase";
import { PostTurnStatusEffectPhase } from "#app/phases/post-turn-status-effect-phase";
import { PhaseId } from "#enums/phase-id";
import { StatusEffect } from "#enums/status-effect";

/**
 * Queues a {@linkcode PostTurnStatusEffectPhase} for every active pokemon that needs one
 * @extends Phase
 */
export class CheckStatusEffectPhase extends Phase {
  override readonly id = PhaseId.CHECK_STATUS_EFFECT;

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
      if (pokemon?.hasStatusEffect([StatusEffect.BURN, StatusEffect.POISON, StatusEffect.TOXIC], false, true)) {
        globalScene.unshiftPhase(new PostTurnStatusEffectPhase(p));
      }
    }
    this.end();
  }
}
