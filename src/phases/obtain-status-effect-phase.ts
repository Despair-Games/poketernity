import type { BattlerIndex } from "#enums/battler-index";
import { CommonBattleAnim } from "#app/data/animations/common-battle-anim";
import { CommonAnim } from "#enums/common-anim";
import { getStatusEffectObtainText, getStatusEffectOverlapText } from "#app/data/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { StatusEffect } from "#enums/status-effect";
import { PokemonPhase } from "./abstract-pokemon-phase";
import { PhaseId } from "#enums/phase-id";

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
    if (pokemon && !pokemon.status) {
      if (pokemon.trySetStatus(this.statusEffect, false, this.sourcePokemon)) {
        if (this.turnsRemaining) {
          pokemon.status!.sleepTurnsRemaining = this.turnsRemaining;
        }
        pokemon.updateInfo(true);
        new CommonBattleAnim(CommonAnim.POISON + (this.statusEffect! - 1), pokemon).play(false, () => {
          globalScene.queueMessage(
            getStatusEffectObtainText(this.statusEffect, getPokemonNameWithAffix(pokemon), this.sourceText),
          );
          this.end();
        });
        return;
      }
    } else if (pokemon.getStatusEffect(true) === this.statusEffect) {
      globalScene.queueMessage(
        getStatusEffectOverlapText(this.statusEffect ?? StatusEffect.NONE, getPokemonNameWithAffix(pokemon)),
      );
    }
    this.end();
  }
}
