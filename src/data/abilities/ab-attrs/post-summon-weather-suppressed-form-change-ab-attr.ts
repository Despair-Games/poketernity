import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { Pokemon } from "#field/pokemon";
import { getPokemonWithWeatherBasedForms } from "#utils/ability-utils";

/**
 * Reverts weather-based forms to their normal forms when the user is summoned.
 * Used by Cloud Nine and Air Lock.
 */
export class PostSummonWeatherSuppressedFormChangeAbAttr extends PostSummonAbAttr {
  public override apply(_pokemon: Pokemon, simulated: boolean): void {
    if (!simulated) {
      globalScene.arena.triggerWeatherBasedFormChangesToNormal();
    }
  }

  public override canApply(..._params: Parameters<this["apply"]>): boolean {
    const pokemonToTransform = getPokemonWithWeatherBasedForms();
    return pokemonToTransform.length > 0;
  }
}
