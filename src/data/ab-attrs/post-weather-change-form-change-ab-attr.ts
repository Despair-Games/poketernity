import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { Abilities } from "#enums/abilities";
import { Species } from "#enums/species";
import type { WeatherType } from "#enums/weather-type";
import { PostWeatherChangeAbAttr } from "./post-weather-change-ab-attr";

/**
 * Triggers weather-based form change when weather changes.
 * Used by Forecast and Flower Gift.
 * @extends PostWeatherChangeAbAttr
 */
export class PostWeatherChangeFormChangeAbAttr extends PostWeatherChangeAbAttr {
  private readonly ability: Abilities;
  private readonly formRevertingWeathers: WeatherType[];

  constructor(ability: Abilities, formRevertingWeathers: WeatherType[]) {
    super(false);

    this.ability = ability;
    this.formRevertingWeathers = formRevertingWeathers;
  }

  /**
   * Calls {@linkcode Arena.triggerWeatherBasedFormChangesToNormal | triggerWeatherBasedFormChangesToNormal} when the
   * weather changed to form-reverting weather, otherwise calls {@linkcode Arena.triggerWeatherBasedFormChanges | triggerWeatherBasedFormChanges}
   * @param pokemon the {@linkcode Pokemon} with this ability
   * @param _passive n/a
   * @param _weather n/a
   * @param _args n/a
   * @returns whether the form change was triggered
   */
  override applyPostWeatherChange(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _weather: WeatherType,
    _args: any[],
  ): boolean {
    const isCastformWithForecast =
      pokemon.species.speciesId === Species.CASTFORM && this.ability === Abilities.FORECAST;
    const isCherrimWithFlowerGift =
      pokemon.species.speciesId === Species.CHERRIM && this.ability === Abilities.FLOWER_GIFT;

    if (isCastformWithForecast || isCherrimWithFlowerGift) {
      if (simulated) {
        return simulated;
      }

      const weatherType = globalScene.arena.weather?.weatherType;

      if (weatherType && this.formRevertingWeathers.includes(weatherType)) {
        globalScene.arena.triggerWeatherBasedFormChangesToNormal();
      } else {
        globalScene.arena.triggerWeatherBasedFormChanges();
      }
      return true;
    }
    return false;
  }
}
