import type { BlockNonDirectDamageAbAttr } from "#app/data/abilities/ab-attrs/block-non-direct-damage-ab-attr";
import type { PostWeatherLapseAbAttr } from "#app/data/abilities/ab-attrs/post-weather-lapse-ab-attr";
import type { PreWeatherDamageAbAttr } from "#app/data/abilities/ab-attrs/pre-weather-damage-ab-attr";
import type { SuppressWeatherEffectAbAttr } from "#app/data/abilities/ab-attrs/suppress-weather-effect-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { getWeatherDamageMessage, getWeatherLapseMessage } from "#app/data/weather";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { CommonAnimPhase } from "#app/phases/common-anim-phase";
import { BooleanHolder, toDmgValue } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { HitResult } from "#enums/hit-result";
import { PhaseId } from "#enums/phase-id";
import { WeatherType } from "#enums/weather-type";

export class WeatherEffectPhase extends CommonAnimPhase {
  override readonly id = PhaseId.WEATHER_EFFECT;

  public override start(): void {
    // Get current weather state at end of turn
    const { arena } = globalScene;
    const weather = arena?.weather;

    if (!weather) {
      return this.end();
    }

    if (!weather.lapse()) {
      arena.trySetWeather(WeatherType.NONE, false);
      arena.triggerWeatherBasedFormChangesToNormal();
      return this.end();
    }

    this.setAnimation(CommonAnim.SUNNY + (weather.weatherType - 1));

    const end = (): void => {
      globalScene.ui.showText(getWeatherLapseMessage(weather.weatherType) ?? "", null, () => {
        this.executeForAll((pokemon: Pokemon) => {
          if (!pokemon.switchOutStatus) {
            applyAbAttrs<PostWeatherLapseAbAttr>(AbAttrFlag.POST_WEATHER_LAPSE, pokemon, false, weather);
          }
        });

        super.start();
      });
    };

    if (!weather.isDamaging()) {
      return end();
    }

    const cancelled = new BooleanHolder(false);

    this.executeForAll((pokemon: Pokemon) =>
      applyAbAttrs<SuppressWeatherEffectAbAttr>(AbAttrFlag.SUPPRESS_WEATHER_EFFECT, pokemon, false, weather, cancelled),
    );

    if (cancelled.value) {
      return end();
    }

    const inflictDamage = (pokemon: Pokemon): void => {
      const cancelled = new BooleanHolder(false);

      applyAbAttrs<PreWeatherDamageAbAttr>(AbAttrFlag.PRE_WEATHER_DAMAGE, pokemon, false, weather, cancelled);
      applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);

      if (cancelled.value || pokemon.getTag(BattlerTagType.UNDERGROUND) || pokemon.getTag(BattlerTagType.UNDERWATER)) {
        return;
      }

      const damage = toDmgValue(pokemon.getMaxHp() / 16);

      globalScene.phaseManager.queueMessagePhase(getWeatherDamageMessage(weather.weatherType, pokemon) ?? "");
      pokemon.damageAndUpdate(damage, { result: HitResult.EFFECTIVE, preventEndure: true });
    };

    this.executeForAll((pokemon: Pokemon) => {
      const immune: boolean =
        !pokemon
        || pokemon.getTypes(true, true).filter((t) => weather?.isTypeDamageImmune(t)).length > 0
        || pokemon.switchOutStatus;
      if (!immune) {
        inflictDamage(pokemon);
      }
    });

    return end();
  }
}
