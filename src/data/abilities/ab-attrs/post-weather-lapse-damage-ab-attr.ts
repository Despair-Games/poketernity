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
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Solar_Power_(Ability)}
 * @see {@link https://bulbapedia.bulbagarden.net/wiki/Dry_Skin_(Ability)}
 */
// TODO: confirm that Dry Skin and Solar Power have differing effects if sun ends the same turn
// Supposedly, Dry Skin will take damage at EoT if the sun ends that turn, whereas Solar Power will not
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
    const pokemonNameWithAffix = getPokemonNameWithAffix(pokemon);
    globalScene.phaseManager.createAndUnshiftPhase(
      "MessagePhase",
      i18next.t("abilityTriggers:postWeatherLapseDamage", { pokemonNameWithAffix, abilityName }),
    );

    pokemon.damageAndUpdate(toDmgValue(pokemon.getMaxHp() * this.damageFactor), { result: HitResult.OTHER });
  }

  public override canApply({ pokemon }: Parameters<this["apply"]>[0]): boolean {
    return !pokemon.hasAbilityWithAttr("BlockNonDirectDamageAbAttr");
  }
}
