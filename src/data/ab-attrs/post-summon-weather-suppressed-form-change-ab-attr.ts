import { getPokemonWithWeatherBasedForms } from "#app/data/ability-utils";
import type Pokemon from "#app/field/pokemon";
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
   * @param _passive n/a
   * @param _args n/a
   * @returns whether a Pokemon was reverted to its normal form
   */
  override applyPostSummon(_pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]) {
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
