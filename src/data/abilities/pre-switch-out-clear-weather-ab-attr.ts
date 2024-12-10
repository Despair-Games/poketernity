import type Pokemon from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { Abilities } from "#enums/abilities";
import { WeatherType } from "#enums/weather-type";
import { PreSwitchOutAbAttr } from "./pre-switch-out-ab-attr";

/**
 * Clears Desolate Land/Primordial Sea/Delta Stream upon the Pokemon switching out.
 */
export class PreSwitchOutClearWeatherAbAttr extends PreSwitchOutAbAttr {
  /**
   * @param pokemon The {@linkcode Pokemon} with the ability
   * @param _passive N/A
   * @param _args N/A
   * @returns {boolean} Returns true if the weather clears, otherwise false.
   */
  override applyPreSwitchOut(pokemon: Pokemon, _passive: boolean, simulated: boolean, _args: any[]): boolean {
    const weatherType = globalScene.arena.weather?.weatherType;
    let turnOffWeather = false;

    // Clear weather only if user's ability matches the weather and no other pokemon has the ability.
    switch (weatherType) {
      case WeatherType.HARSH_SUN:
        if (
          pokemon.hasAbility(Abilities.DESOLATE_LAND)
          && globalScene
            .getField(true)
            .filter((p) => p !== pokemon)
            .filter((p) => p.hasAbility(Abilities.DESOLATE_LAND)).length === 0
        ) {
          turnOffWeather = true;
        }
        break;
      case WeatherType.HEAVY_RAIN:
        if (
          pokemon.hasAbility(Abilities.PRIMORDIAL_SEA)
          && globalScene
            .getField(true)
            .filter((p) => p !== pokemon)
            .filter((p) => p.hasAbility(Abilities.PRIMORDIAL_SEA)).length === 0
        ) {
          turnOffWeather = true;
        }
        break;
      case WeatherType.STRONG_WINDS:
        if (
          pokemon.hasAbility(Abilities.DELTA_STREAM)
          && globalScene
            .getField(true)
            .filter((p) => p !== pokemon)
            .filter((p) => p.hasAbility(Abilities.DELTA_STREAM)).length === 0
        ) {
          turnOffWeather = true;
        }
        break;
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