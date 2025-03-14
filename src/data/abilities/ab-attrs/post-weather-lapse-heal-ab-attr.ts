import type { Weather } from "#app/data/weather";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { toDmgValue } from "#app/utils";
import type { WeatherType } from "#enums/weather-type";
import i18next from "i18next";
import { PostWeatherLapseAbAttr } from "./post-weather-lapse-ab-attr";

/**
 * Heals the ability holder by a specified amount during ability-specific weather conditions
 * ```
+-----------+------------------+---------------+
|  Ability  |    Weather(s)    | Max. HP Ratio |
+-----------+------------------+---------------+
| Rain Dish | Rain, Heavy Rain | 1/16          |
| Ice Body  | Hail, Snow       | 1/16          |
| Dry Skin  | Rain, Heavy Rain | 1/8           |
+-----------+------------------+---------------+
 * ```
 */
export class PostWeatherLapseHealAbAttr extends PostWeatherLapseAbAttr {
  private readonly healRatio: number;

  /**
   * @param healRatio - Multiplied with the user's max HP to determine how much HP is healed
   * @param weatherTypes - the {@linkcode WeatherType | weather} conditions during which the ability activates
   */
  constructor(healRatio: number, ...weatherTypes: WeatherType[]) {
    super(...weatherTypes);

    this.healRatio = healRatio;
  }

  override apply(pokemon: Pokemon, simulated: boolean, _weather: Weather): boolean {
    if (!pokemon.isFullHp()) {
      const abilityName = this.source.name;
      if (!simulated) {
        globalScene.queuePokemonHeal(true, pokemon.getBattlerIndex(), toDmgValue(pokemon.getMaxHp() * this.healRatio), {
          message: i18next.t("abilityTriggers:postWeatherLapseHeal", {
            pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
            abilityName,
          }),
        });
      }
      return true;
    }

    return false;
  }
}
