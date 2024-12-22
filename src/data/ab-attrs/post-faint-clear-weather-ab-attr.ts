import type { Move } from "#app/data/move";
import type { Pokemon } from "#app/field/pokemon";
import type { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { Abilities } from "#enums/abilities";
import { WeatherType } from "#enums/weather-type";
import { PostFaintAbAttr } from "./post-faint-ab-attr";

/**
 * Clears Desolate Land/Primordial Sea/Delta Stream upon the Pokemon fainting
 * @extends PostFaintAbAttr
 */
export class PostFaintClearWeatherAbAttr extends PostFaintAbAttr {
  /**
   * @param pokemon The {@linkcode Pokemon} with the ability
   * @param _passive N/A
   * @param _attacker N/A
   * @param _move N/A
   * @param _hitResult N/A
   * @param _args N/A
   * @returns Returns true if the weather clears, otherwise false.
   */
  override applyPostFaint(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    _attacker?: Pokemon,
    _move?: Move,
    _hitResult?: HitResult,
    ..._args: any[]
  ): boolean {
    const weatherType = globalScene.arena.weather?.weatherType;
    let turnOffWeather = false;
    let weatherAbility: Abilities | null = null;

    // Clear weather only if user's ability matches the weather and no other pokemon has the ability.
    switch (weatherType) {
      case WeatherType.HARSH_SUN:
        weatherAbility = Abilities.DESOLATE_LAND;
        break;
      case WeatherType.HEAVY_RAIN:
        weatherAbility = Abilities.PRIMORDIAL_SEA;
        break;
      case WeatherType.STRONG_WINDS:
        weatherAbility = Abilities.DELTA_STREAM;
        break;
    }

    if (
      weatherAbility
      && pokemon.hasAbility(weatherAbility)
      && globalScene.getField(true).filter((p) => p.hasAbility(weatherAbility)).length === 0
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
