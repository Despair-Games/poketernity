import { SpeciesFormChangeRevertWeatherFormTrigger, SpeciesFormChangeWeatherTrigger } from "#app/data/pokemon-forms";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { AbilityId } from "#enums/ability-id";
import { SpeciesId } from "#enums/species-id";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Triggers weather-based form change when summoned into an active weather.
 * Used by Forecast and Flower Gift.
 * @extends PostSummonAbAttr
 */
export class PostSummonFormChangeByWeatherAbAttr extends PostSummonAbAttr {
  private readonly ability: AbilityId;

  constructor(ability: AbilityId) {
    super(true, true);

    this.ability = ability;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const isCastformWithForecast =
      pokemon.species.speciesId === SpeciesId.CASTFORM && this.ability === AbilityId.FORECAST;
    const isCherrimWithFlowerGift =
      pokemon.species.speciesId === SpeciesId.CHERRIM && this.ability === AbilityId.FLOWER_GIFT;

    if (isCastformWithForecast || isCherrimWithFlowerGift) {
      if (simulated) {
        return simulated;
      }

      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeWeatherTrigger);
      globalScene.triggerPokemonFormChange(pokemon, SpeciesFormChangeRevertWeatherFormTrigger);
      return true;
    }
    return false;
  }
}
