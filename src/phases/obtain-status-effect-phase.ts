import { CommonBattleAnim } from "#animations/common-battle-anim";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { getStatusEffectObtainText, getStatusEffectOverlapText } from "#data/status-effect";
import type { BattlerIndex } from "#enums/battler-index";
import { CommonAnim } from "#enums/common-anim";
import { PhaseId } from "#enums/phase-id";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import { PokemonPhase } from "#phases/abstract-pokemon-phase";

/**
 * Applies a status effect to a pokemon
 * @extends PokemonPhase
 */
export class ObtainStatusEffectPhase extends PokemonPhase {
  override readonly id = PhaseId.OBTAIN_STATUS_EFFECT;

  private readonly statusEffect: StatusEffect;
  private readonly turnsRemaining?: number;
  private readonly sourceText?: string | null;
  private readonly sourcePokemon?: Pokemon | null;

  constructor(
    battlerIndex: BattlerIndex,
    statusEffect: StatusEffect,
    turnsRemaining?: number,
    sourceText?: string | null,
    sourcePokemon?: Pokemon | null,
  ) {
    super(battlerIndex);

    this.statusEffect = statusEffect;
    this.turnsRemaining = turnsRemaining;
    this.sourceText = sourceText;
    this.sourcePokemon = sourcePokemon;
  }

  public override start(): void {
    const pokemon = this.getPokemon();
    if (pokemon && !pokemon.hasNonVolatileStatusEffect(false, true)) {
      if (pokemon.trySetStatus(this.statusEffect, false, this.sourcePokemon, this.turnsRemaining, this.sourceText)) {
        pokemon.updateInfo(true);
        new CommonBattleAnim(CommonAnim.POISON + (this.statusEffect - 1), pokemon).play(false, () => {
          const effectObtainText = getStatusEffectObtainText(
            this.statusEffect,
            getPokemonNameWithAffix(pokemon),
            this.sourceText,
          );
          globalScene.phaseManager.queueMessagePhase(effectObtainText);
          this.end();
        });
        return;
      }
    } else if (pokemon.getStatusEffect(true) === this.statusEffect) {
      const effectOverlapText = getStatusEffectOverlapText(
        this.statusEffect ?? StatusEffect.NONE,
        getPokemonNameWithAffix(pokemon),
      );
      globalScene.phaseManager.queueMessagePhase(effectOverlapText);
    }
    this.end();
  }
}
