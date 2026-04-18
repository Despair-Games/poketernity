import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import { getPokemonWithWeatherBasedForms } from "#utils/ability-utils";

/**
 * Reverts weather-based forms to their normal forms when the user is summoned.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Air_Lock_(Ability)}
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Cloud_Nine_(Ability)}
 */
export class PostSummonWeatherSuppressedFormChangeAbAttr extends PostSummonAbAttr {
  public override apply({ simulated }: BaseAbAttrParams): void {
    if (!simulated) {
      globalScene.arena.triggerWeatherBasedFormChangesToNormal();
    }
  }

  public override canApply(): boolean {
    const pokemonToTransform = getPokemonWithWeatherBasedForms();
    return pokemonToTransform.length > 0;
  }
}
