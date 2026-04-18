import { PostSummonAbAttr } from "#abilities/post-summon-ab-attr";
import { globalScene } from "#app/global-scene";
import { SpeciesFormChangeRevertWeatherFormTrigger, SpeciesFormChangeWeatherTrigger } from "#data/pokemon-forms";
import { AbilityId } from "#enums/ability-id";
import { SpeciesId } from "#enums/species-id";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";

/**
 * Triggers weather-based form change when summoned into an active weather.
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Forecast_(Ability)}
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Flower_Gift_(Ability)}
 */
// TODO: implement https://github.com/pagefaultgames/pokerogue/pull/5857
// don't forget `PostWeatherChangeFormChangeAbAttr`'s `canApply`
export class PostSummonFormChangeByWeatherAbAttr extends PostSummonAbAttr {
  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (!simulated) {
      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeWeatherTrigger);
      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeRevertWeatherFormTrigger);
    }
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    const isCastformWithForecast =
      pokemon.species.speciesId === SpeciesId.CASTFORM && this.source.id === AbilityId.FORECAST;
    const isCherrimWithFlowerGift =
      pokemon.species.speciesId === SpeciesId.CHERRIM && this.source.id === AbilityId.FLOWER_GIFT;

    return isCastformWithForecast || isCherrimWithFlowerGift;
  }
}
