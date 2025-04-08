import { PostWeatherLapseAbAttr } from "#app/data/abilities/ab-attrs/post-weather-lapse-ab-attr";
import type { Weather } from "#app/data/weather";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { toDmgValue } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { HitResult } from "#enums/hit-result";
import type { WeatherType } from "#enums/weather-type";
import i18next from "i18next";

/**
 * Ability attribute that inflicts damage on the ability holder in certain weather conditions
 * Used by the abilities Dry Skin and Solar Power, which both inflict 1/8 of the ability holder's HP in sun or harsh sun
 */
export class PostWeatherLapseDamageAbAttr extends PostWeatherLapseAbAttr {
  private readonly damageFactor: number;

  constructor(damageFactor: number, ...weatherTypes: WeatherType[]) {
    super(...weatherTypes);

    this.damageFactor = damageFactor;
  }

  override apply(pokemon: Pokemon, simulated: boolean, _weather: Weather): boolean {
    if (pokemon.hasAbilityWithAttr(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE)) {
      return false;
    }

    if (!simulated) {
      const abilityName = this.source.name;
      globalScene.phaseManager.queueMessagePhase(
        i18next.t("abilityTriggers:postWeatherLapseDamage", {
          pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
          abilityName,
        }),
      );
      pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() * this.damageFactor), {
        result: HitResult.OTHER,
      });
    }

    return true;
  }
}
