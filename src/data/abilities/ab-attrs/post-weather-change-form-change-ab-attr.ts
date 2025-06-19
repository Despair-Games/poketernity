import { PostWeatherChangeAbAttr } from "#abilities/post-weather-change-ab-attr";
import { globalScene } from "#app/global-scene";
import { AbilityId } from "#enums/ability-id";
import { SpeciesId } from "#enums/species-id";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";

/**
 * Triggers weather-based form change when weather changes.
 * Used by Forecast and Flower Gift.
 */
export class PostWeatherChangeFormChangeAbAttr extends PostWeatherChangeAbAttr {
  private readonly ability: AbilityId;
  private readonly formRevertingWeathers: WeatherType[];

  constructor(ability: AbilityId, formRevertingWeathers: WeatherType[]) {
    super(false);

    this.ability = ability;
    this.formRevertingWeathers = formRevertingWeathers;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, _weather: WeatherType): boolean {
    const isCastformWithForecast =
      pokemon.species.speciesId === SpeciesId.CASTFORM && this.ability === AbilityId.FORECAST;
    const isCherrimWithFlowerGift =
      pokemon.species.speciesId === SpeciesId.CHERRIM && this.ability === AbilityId.FLOWER_GIFT;

    if (isCastformWithForecast || isCherrimWithFlowerGift) {
      if (simulated) {
        return simulated;
      }

      const weatherType = globalScene.arena.weather?.weatherType;

      if (!weatherType || this.formRevertingWeathers.includes(weatherType)) {
        globalScene.arena.triggerWeatherBasedFormChangesToNormal();
      } else {
        globalScene.arena.triggerWeatherBasedFormChanges();
      }
      return true;
    }
    return false;
  }
}
