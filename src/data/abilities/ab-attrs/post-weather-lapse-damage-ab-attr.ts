import { PostWeatherLapseAbAttr } from "#abilities/post-weather-lapse-ab-attr";
import { globalScene } from "#app/global-scene";
import { getPokemonNameWithAffix } from "#app/messages";
import { HitResult } from "#enums/hit-result";
import type { WeatherType } from "#enums/weather-type";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
import type { NonEmptyArray } from "#types/utility-types";
import { toDmgValue } from "#utils/common-utils";
import i18next from "i18next";

/**
 * These abilities inflict damage on the ability holder under specific weather conditions.
 *
 * | Ability     | Weather Condition           | Effect                                            | Notes                                                   |
 * |-------------|-----------------------------|---------------------------------------------------|---------------------------------------------------------|
 * | Solar Power |**\|** (Extremely) Harsh Sun |**\|** Inflicts 1/8 of the user's max HP as damage |**\|** No damage if sunny weather fades on the same turn |
 * | Dry Skin    |**\|** (Extremely) Harsh Sun |**\|** Inflicts 1/8 of the user's max HP as damage |**\|** -                                                 |
 *
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Solar_Power_(Ability) Solar Power (Ability) - Bulbapedia}
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Dry_Skin_(Ability) Dry Skin (Ability) - Bulbapedia}
 */
export class PostWeatherLapseDamageAbAttr extends PostWeatherLapseAbAttr {
  private readonly damageFactor: number;

  constructor(damageFactor: number, ...weatherTypes: Readonly<NonEmptyArray<WeatherType>>) {
    super(...weatherTypes);

    this.damageFactor = damageFactor;
  }

  public override apply({ pokemon, simulated }: BaseAbAttrParams): void {
    if (simulated) {
      return;
    }

    const abilityName = this.source.name;
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("abilityTriggers:postWeatherLapseDamage", {
        pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
        abilityName,
      }),
    );
    pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() * this.damageFactor), {
      result: HitResult.OTHER,
    });
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return !pokemon.hasAbilityWithAttr("BlockNonDirectDamageAbAttr");
  }
}
