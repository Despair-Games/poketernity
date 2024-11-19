import type BattleScene from "#app/battle-scene";
import { applyPreWeatherEffectAbAttrs, SuppressWeatherEffectAbAttr, PreWeatherDamageAbAttr, applyAbAttrs, BlockNonDirectDamageAbAttr, applyPostWeatherLapseAbAttrs, PostWeatherLapseAbAttr } from "#app/data/ability";
import { CommonAnim } from "#app/data/battle-anims";
import { type Weather, getWeatherDamageMessage, getWeatherLapseMessage } from "#app/data/weather";
import { BattlerTagType } from "#app/enums/battler-tag-type";
import { WeatherType } from "#app/enums/weather-type";
import type Pokemon from "#app/field/pokemon";
import { HitResult } from "#app/field/pokemon";
import { BooleanHolder, toDmgValue } from "#app/utils";
import { CommonAnimPhase } from "./common-anim-phase";

export class WeatherEffectPhase extends CommonAnimPhase {
  public weather: Weather | null;

  constructor(scene: BattleScene) {
    super(scene, undefined, undefined, CommonAnim.SUNNY + ((scene?.arena?.weather?.weatherType ?? WeatherType.NONE) - 1));
    this.weather = scene?.arena?.weather;
  }

  start() {
    // Update weather state with any changes that occurred during the turn
    this.weather = this.scene?.arena?.weather;
    // Fix TS compiler issues
    const weather = this.weather;

    if (!weather) {
      return this.end();
    }

    this.setAnimation(CommonAnim.SUNNY + (weather.weatherType - 1));

    if (weather.isDamaging()) {

      const cancelled = new BooleanHolder(false);

      this.executeForAll((pokemon: Pokemon) => applyPreWeatherEffectAbAttrs(SuppressWeatherEffectAbAttr, pokemon, weather, cancelled));

      if (!cancelled.value) {
        const inflictDamage = (pokemon: Pokemon) => {
          const cancelled = new BooleanHolder(false);

          applyPreWeatherEffectAbAttrs(PreWeatherDamageAbAttr, pokemon, weather, cancelled);
          applyAbAttrs(BlockNonDirectDamageAbAttr, pokemon, cancelled);

          if (cancelled.value || pokemon.getTag(BattlerTagType.UNDERGROUND) || pokemon.getTag(BattlerTagType.UNDERWATER)) {
            return;
          }

          const damage = toDmgValue(pokemon.getMaxHp() / 16);

          this.scene.queueMessage(getWeatherDamageMessage(weather.weatherType, pokemon) ?? "");
          pokemon.damageAndUpdate(damage, HitResult.EFFECTIVE, false, false, true);
        };

        this.executeForAll((pokemon: Pokemon) => {
          const immune = !pokemon || !!pokemon.getTypes(true, true).filter(t => weather.isTypeDamageImmune(t)).length;
          if (!immune) {
            inflictDamage(pokemon);
          }
        });
      }
    }

    this.scene.ui.showText(getWeatherLapseMessage(weather.weatherType) ?? "", null, () => {
      this.executeForAll((pokemon: Pokemon) => applyPostWeatherLapseAbAttrs(PostWeatherLapseAbAttr, pokemon, weather));

      super.start();
    });
  }
}
