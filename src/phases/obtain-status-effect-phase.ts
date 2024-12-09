import type { BattlerIndex } from "#app/battle";
import { CommonAnim, CommonBattleAnim } from "#app/data/battle-anims";
import { getStatusEffectObtainText, getStatusEffectOverlapText } from "#app/data/status-effect";
import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { StatusEffect } from "#enums/status-effect";
import { PokemonPhase } from "./pokemon-phase";

/**
 * Applies a status effect to a pokemon
 * @extends PokemonPhase
 */
export class ObtainStatusEffectPhase extends PokemonPhase {
  // TODO: Should this be able to be undefined? Early return if so?
  private statusEffect?: StatusEffect;
  private turnsRemaining?: number;
  private sourceText?: string | null;
  private sourcePokemon?: Pokemon | null;

  constructor(
    battlerIndex: BattlerIndex,
    statusEffect?: StatusEffect,
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
    } else if (pokemon.status?.effect === this.statusEffect) {
      globalScene.queueMessage(
        getStatusEffectOverlapText(this.statusEffect ?? StatusEffect.NONE, getPokemonNameWithAffix(pokemon)),
      );
    }
    this.end();
  }
}
