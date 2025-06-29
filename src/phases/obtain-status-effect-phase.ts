import { CommonBattleAnim } from "#animations/common-battle-anim";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { FieldBattlerIndex } from "#enums/battler-index";
import { CommonAnim } from "#enums/common-anim";
import { StatusEffect } from "#enums/status-effect";
import type { Pokemon } from "#field/pokemon";
import { PokemonPhase } from "#phases/base/pokemon-phase";
import { getStatusEffectObtainText, getStatusEffectOverlapText } from "#utils/status-effect-utils";

/**
 * Applies a status effect to a pokemon
 */
export class ObtainStatusEffectPhase extends PokemonPhase {
  public override readonly phaseName = "ObtainStatusEffectPhase";

  private readonly statusEffect: StatusEffect;
  private readonly turnsRemaining?: number;
  private readonly sourceText?: string | null;
  private readonly sourcePokemon?: Pokemon | null;

  constructor(
    battlerIndex: FieldBattlerIndex,
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
        new CommonBattleAnim((CommonAnim.POISON + (this.statusEffect - 1)) as CommonAnim, pokemon).play(false, () => {
          const effectObtainText = getStatusEffectObtainText(
            this.statusEffect,
            getPokemonNameWithAffix(pokemon),
            this.sourceText,
          );
          globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", effectObtainText);
          this.end();
        });
        return;
      }
    } else if (pokemon.getStatusEffect(true) === this.statusEffect) {
      const effectOverlapText = getStatusEffectOverlapText(
        this.statusEffect ?? StatusEffect.NONE,
        getPokemonNameWithAffix(pokemon),
      );
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", effectOverlapText);
    }
    this.end();
  }
}
