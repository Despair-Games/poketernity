import { getPokemonWithWeatherBasedForms } from "#app/data/ability-utils";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Reverts weather-based forms to their normal forms when the user is summoned.
 * Used by Cloud Nine and Air Lock.
 * @extends PostSummonAbAttr
 */
export class PostSummonWeatherSuppressedFormChangeAbAttr extends PostSummonAbAttr {
  /**
   * Triggers {@linkcode globalScene.arena.triggerWeatherBasedFormChangesToNormal | triggerWeatherBasedFormChangesToNormal}
   * @param _pokemon the {@linkcode Pokemon} with this ability
   * @param simulated if `true`, suppresses changes to game state
   * @returns `true` if a Pokemon was reverted to its normal form
   */
  override apply(_pokemon: Pokemon, simulated: boolean) {
    const pokemonToTransform = getPokemonWithWeatherBasedForms();

    if (pokemonToTransform.length < 1) {
      return false;
    }

    if (!simulated) {
      globalScene.arena.triggerWeatherBasedFormChangesToNormal();
    }

    return true;
  }
}
