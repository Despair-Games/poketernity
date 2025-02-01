import { applyAbAttrs } from "#app/data/apply-ab-attrs";
import { CommonAnim } from "#enums/common-anim";
import { type Weather, getWeatherDamageMessage, getWeatherLapseMessage } from "#app/data/weather";
import { type Pokemon } from "#app/field/pokemon";
import { HitResult } from "#enums/hit-result";
import { globalScene } from "#app/global-scene";
import { BooleanHolder, toDmgValue } from "#app/utils";
import { BattlerTagType } from "#enums/battler-tag-type";
import { WeatherType } from "#enums/weather-type";
import { CommonAnimPhase } from "./common-anim-phase";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class WeatherEffectPhase extends CommonAnimPhase {
  public weather: Weather | null;

  constructor() {
    super(
      undefined,
      undefined,
      CommonAnim.SUNNY + ((globalScene?.arena?.weather?.weatherType ?? WeatherType.NONE) - 1),
    );
    this.weather = globalScene?.arena?.weather;
  }

  public override start(): void {
    // Update weather state with any changes that occurred during the turn
    this.weather = globalScene?.arena?.weather;

    const { weather } = this;

    if (!weather) {
      return this.end();
    }

    this.setAnimation(CommonAnim.SUNNY + (weather.weatherType - 1));

    if (weather.isDamaging()) {
      const cancelled = new BooleanHolder(false);

      this.executeForAll((pokemon: Pokemon) =>
        applyAbAttrs(AbAttrFlag.SUPPRESS_WEATHER_EFFECT, pokemon, false, weather, cancelled),
      );

      if (!cancelled.value) {
        const inflictDamage = (pokemon: Pokemon): void => {
          const cancelled = new BooleanHolder(false);

          applyAbAttrs(AbAttrFlag.PRE_WEATHER_DAMAGE, pokemon, false, weather, cancelled);
          applyAbAttrs(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);

          if (
            cancelled.value
            || pokemon.getTag(BattlerTagType.UNDERGROUND)
            || pokemon.getTag(BattlerTagType.UNDERWATER)
          ) {
            return;
          }

          const damage = toDmgValue(pokemon.getMaxHp() / 16);

          globalScene.queueMessage(getWeatherDamageMessage(weather.weatherType, pokemon) ?? "");
          pokemon.damageAndUpdate(damage, HitResult.EFFECTIVE, false, false, true);
        };

        this.executeForAll((pokemon: Pokemon) => {
          const immune =
            !pokemon
            || !!pokemon.getTypes(true, true).filter((t) => weather?.isTypeDamageImmune(t)).length
            || pokemon.switchOutStatus;
          if (!immune) {
            inflictDamage(pokemon);
          }
        });
      }
    }

    globalScene.ui.showText(getWeatherLapseMessage(weather.weatherType) ?? "", null, () => {
      this.executeForAll((pokemon: Pokemon) => {
        if (!pokemon.switchOutStatus) {
          applyAbAttrs(AbAttrFlag.POST_WEATHER_LAPSE, pokemon, false, weather);
        }
      });

      super.start();
    });
  }
}
