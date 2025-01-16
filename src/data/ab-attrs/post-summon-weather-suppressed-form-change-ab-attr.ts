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
