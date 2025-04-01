import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { AbilityId } from "#enums/ability-id";
import { WeatherType } from "#enums/weather-type";
import { PreSwitchOutAbAttr } from "./pre-switch-out-ab-attr";

/**
 * Clears Desolate Land/Primordial Sea/Delta Stream upon the Pokemon switching out.
 * @extends PreSwitchOutAbAttr
 */
export class PreSwitchOutClearWeatherAbAttr extends PreSwitchOutAbAttr {
  override apply(pokemon: Pokemon, simulated: boolean): boolean {
    const weatherType = globalScene.arena.weather?.weatherType;
    let turnOffWeather = false;
    let weatherAbility: AbilityId | null = null;

    // Clear weather only if user's ability matches the weather and no other pokemon has the ability.
    switch (weatherType) {
      case WeatherType.HARSH_SUN:
        weatherAbility = AbilityId.DESOLATE_LAND;
        break;
      case WeatherType.HEAVY_RAIN:
        weatherAbility = AbilityId.PRIMORDIAL_SEA;
        break;
      case WeatherType.STRONG_WINDS:
        weatherAbility = AbilityId.DELTA_STREAM;
        break;
    }

    if (
      weatherAbility
      && pokemon.hasAbility(weatherAbility)
      && !globalScene
        .getField(true)
        .filter((p) => p !== pokemon)
        .some((p) => p.hasAbility(weatherAbility))
    ) {
      turnOffWeather = true;
    }

    if (simulated) {
      return turnOffWeather;
    }

    if (turnOffWeather) {
      globalScene.arena.trySetWeather(WeatherType.NONE, false);
      return true;
    }

    return false;
  }
}
