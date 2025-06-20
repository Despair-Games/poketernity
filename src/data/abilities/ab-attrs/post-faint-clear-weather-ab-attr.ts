import { PostFaintAbAttr } from "#abilities/post-faint-ab-attr";
import { globalScene } from "#app/global-scene";
import { AbilityId } from "#enums/ability-id";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";

/**
 * Clears Desolate Land/Primordial Sea/Delta Stream upon the Pokemon fainting
 */
export class PostFaintClearWeatherAbAttr extends PostFaintAbAttr {
  public override apply(pokemon: Pokemon, simulated: boolean, _attacker?: Pokemon, _move?: Move): boolean {
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
