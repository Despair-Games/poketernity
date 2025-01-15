import { SpeciesFormChangeRevertWeatherFormTrigger, SpeciesFormChangeWeatherTrigger } from "#app/data/pokemon-forms";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { Abilities } from "#enums/abilities";
import { Species } from "#enums/species";
import { PostSummonAbAttr } from "./post-summon-ab-attr";

/**
 * Triggers weather-based form change when summoned into an active weather.
 * Used by Forecast and Flower Gift.
 * @extends PostSummonAbAttr
 */
export class PostSummonFormChangeByWeatherAbAttr extends PostSummonAbAttr {
  private readonly ability: Abilities;

  constructor(ability: Abilities) {
    super(true, true);

    this.ability = ability;
  }

  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const isCastformWithForecast =
      pokemon.species.speciesId === Species.CASTFORM && this.ability === Abilities.FORECAST;
    const isCherrimWithFlowerGift =
      pokemon.species.speciesId === Species.CHERRIM && this.ability === Abilities.FLOWER_GIFT;

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
