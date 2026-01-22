import { PostFaintAbAttr } from "#abilities/post-faint-ab-attr";
import { globalScene } from "#app/global-scene";
import type { PostFaintAbAttrParams } from "#types/ab-attr-param-types";
import { getPokemonWithWeatherBasedForms } from "#utils/ability-utils";

/**
 * Used for weather suppressing abilities to trigger weather-based form changes upon being fainted.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Cloud_Nine_(Ability) | Cloud Nine (Bulbapedia)}
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Air_Lock_(Ability) | Air Lock (Bulbapedia)}
 */
export class PostFaintUnsuppressedWeatherFormChangeAbAttr extends PostFaintAbAttr {
  public override apply({ simulated }: PostFaintAbAttrParams): void {
    if (!simulated) {
      globalScene.arena.triggerWeatherBasedFormChanges();
    }
  }

  public override canApply(): boolean {
    return getPokemonWithWeatherBasedForms().length > 0;
  }
}
