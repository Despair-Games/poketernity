import type Pokemon from "#app/field/pokemon";
import { HitResult } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { toDmgValue } from "#app/utils";
import type { WeatherType } from "#enums/weather-type";
import i18next from "i18next";
import type { Weather } from "../weather";
import { BlockNonDirectDamageAbAttr } from "./block-non-direct-damage-ab-attr";
import { PostWeatherLapseAbAttr } from "./post-weather-lapse-ab-attr";

export class PostWeatherLapseDamageAbAttr extends PostWeatherLapseAbAttr {
  private damageFactor: number;

  constructor(damageFactor: number, ...weatherTypes: WeatherType[]) {
    super(...weatherTypes);

    this.damageFactor = damageFactor;
  }

  override applyPostWeatherLapse(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    _weather: Weather,
    _args: any[],
  ): boolean {
    if (pokemon.hasAbilityWithAttr(BlockNonDirectDamageAbAttr)) {
      return false;
    }

    if (!simulated) {
      const abilityName = (!passive ? pokemon.getAbility() : pokemon.getPassiveAbility()).name;
      globalScene.queueMessage(
        i18next.t("abilityTriggers:postWeatherLapseDamage", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          abilityName,
        }),
      );
      pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() / (16 / this.damageFactor)), HitResult.OTHER);
    }

    return true;
  }
}
