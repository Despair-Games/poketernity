import type { Weather } from "#app/data/weather";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { PokemonHealPhase } from "#app/phases/pokemon-heal-phase";
import { toDmgValue } from "#app/utils";
import type { WeatherType } from "#enums/weather-type";
import i18next from "i18next";
import { PostWeatherLapseAbAttr } from "./post-weather-lapse-ab-attr";

export class PostWeatherLapseHealAbAttr extends PostWeatherLapseAbAttr {
  private readonly healFactor: number;

  constructor(healFactor: number, ...weatherTypes: WeatherType[]) {
    super(...weatherTypes);

    this.healFactor = healFactor;
  }

  override applyPostWeatherLapse(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    _weather: Weather,
    _args: any[],
  ): boolean {
    if (!pokemon.isFullHp()) {
      const abilityName = (!passive ? pokemon.getAbility() : pokemon.getPassiveAbility()).name;
      if (!simulated) {
        globalScene.unshiftPhase(
          new PokemonHealPhase(
            pokemon.getBattlerIndex(),
            toDmgValue(pokemon.getMaxHp() / (16 / this.healFactor)),
            i18next.t("abilityTriggers:postWeatherLapseHeal", {
              pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
              abilityName,
            }),
            true,
          ),
        );
      }
      return true;
    }

    return false;
  }
}
