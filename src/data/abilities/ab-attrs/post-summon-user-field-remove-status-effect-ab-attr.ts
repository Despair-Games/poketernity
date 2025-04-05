import { getStatusEffectHealText } from "#app/data/status-effect";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { StatusEffect } from "#enums/status-effect";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Removes supplied status effects from the user's field. Used by Pastel Veil.
 * @extends PostSummonAbAttr
 */
export class PostSummonUserFieldRemoveStatusEffectAbAttr extends PostSummonAbAttr {
  private readonly statusEffects: StatusEffect[];

  /**
   * @param statusEffect - The status effects to be removed from the user's field.
   */
  constructor(...statusEffect: StatusEffect[]) {
    super(false);

    this.statusEffects = statusEffect;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const allowedPokemon = pokemon.getField().filter((p) => p.isAllowedInBattle());

    if (allowedPokemon.length < 1) {
      return false;
    }

    if (!simulated) {
      for (const pokemon of allowedPokemon) {
        if (pokemon.hasStatusEffect(this.statusEffects, false, true)) {
          globalScene.phaseManager.queueMessagePhase(
            getStatusEffectHealText(pokemon.getStatusEffect(true), getPokemonNameWithAffix(pokemon)),
          );
          pokemon.resetStatus();
          pokemon.updateInfo();
        }
      }
    }
    return true;
  }
}
