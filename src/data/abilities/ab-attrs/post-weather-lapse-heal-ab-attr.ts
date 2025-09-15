import { PostWeatherLapseAbAttr } from "#abilities/post-weather-lapse-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

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

  public override apply(pokemon: Pokemon, simulated: boolean): boolean {
    if (!pokemon.isFullHp()) {
      const abilityName = this.source.name;
      if (!simulated) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "PokemonHealPhase",
          pokemon.getBattlerIndex(),
          toDmgValue(pokemon.getMaxHp() * this.healRatio),
          {
            message: i18next.t("abilityTriggers:postWeatherLapseHeal", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              abilityName,
            }),
          },
        );
      }
      return true;
    }

    return false;
  }
}
