import { WEATHER_DAMAGE_RATIO } from "#app/constants/weather-constants";
import type { BlockNonDirectDamageAbAttr } from "#app/data/abilities/ab-attrs/block-non-direct-damage-ab-attr";
import type { PostWeatherLapseAbAttr } from "#app/data/abilities/ab-attrs/post-weather-lapse-ab-attr";
import type { PreWeatherDamageAbAttr } from "#app/data/abilities/ab-attrs/pre-weather-damage-ab-attr";
import type { SuppressWeatherEffectAbAttr } from "#app/data/abilities/ab-attrs/suppress-weather-effect-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { CommonBattleAnim } from "#app/data/animations/common-battle-anim";
import { getWeatherDamageMessage, getWeatherLapseMessage, type Weather } from "#app/data/weather";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { FieldPhase } from "#app/phases/abstract-field-phase";
import { BooleanHolder, toDmgValue } from "#app/utils/common-utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { CommonAnim } from "#enums/common-anim";
import { HitResult } from "#enums/hit-result";
import { PhaseId } from "#enums/phase-id";
import { WeatherType } from "#enums/weather-type";

/**
 * Applies the end-of-turn effects from active {@linkcode Weather}, including
 * - the weather's post-turn animation and message
 * - the damaging effects of Hail and Sandstorm
 * - all post-turn ability triggers dependent on the current weather
 * (e.g. Rain Dish, Dry Skin)
 * @extends FieldPhase
 */
export class WeatherEffectPhase extends FieldPhase {
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

    const weatherAnimType: CommonAnim = CommonAnim.SUNNY + (weather.weatherType - 1);
    /** @todo Rework animation params so that the placeholder "user" can be removed */
    const weatherAnim = new CommonBattleAnim(weatherAnimType, globalScene.getPlayerPokemon()!, undefined, true);

    globalScene.ui.showText(getWeatherLapseMessage(weather.weatherType) ?? "", null, () => {
      // (36, 80) is the player's center-field position
      weatherAnim.playWithoutTargets(36, 80, 2, 5, () => {
        this.applyWeatherEffects(weather);
        this.end();
      });
    });
  }

  /**
   * Applies the end-of-turn effects from the current weather, including
   * - Damage from Sandstorm and Hail
   * - Ability triggers, e.g. healing from {@link https://bulbapedia.bulbagarden.net/wiki/Rain_Dish_(Ability) | Rain Dish}
   * @param weather - The current {@linkcode Weather} on the field
   */
  private applyWeatherEffects(weather: Weather): void {
    if (this.tryCancelWeatherEffects(weather)) {
      return;
    }

    this.executeForAll((pokemon: Pokemon) => this.tryInflictWeatherDamage(weather, pokemon));

    this.executeForAll((pokemon: Pokemon) => {
      if (!pokemon.switchOutStatus) {
        applyAbAttrs<PostWeatherLapseAbAttr>(AbAttrFlag.POST_WEATHER_LAPSE, pokemon, false, weather);
      }
    });
  }

  /**
   * Checks the field for effects that nullify the current weather's end-of-turn effects
   * @param weather - The current {@linkcode Weather} on the field
   * @returns `true` if the weather is suppressed
   *
   * @todo Merge this logic with {@linkcode Weather.isEffectSuppressed}. This method applies the suppressing attributes directly
   * while `isEffectSuppressed` uses a `hasAbility` check to avoid flyouts appearing at the wrong time. These may
   * be combined by rewriting `isEffectSuppressed` to support simulated application.
   */
  private tryCancelWeatherEffects(weather: Weather): boolean {
    const cancelled = new BooleanHolder(false);

    this.executeForAll((pokemon: Pokemon) =>
      applyAbAttrs<SuppressWeatherEffectAbAttr>(AbAttrFlag.SUPPRESS_WEATHER_EFFECT, pokemon, false, weather, cancelled),
    );

    return cancelled.value;
  }

  /**
   * Inflicts damage on the given Pokemon from the end-of-turn effects
   * of specific {@linkcode WeatherType | types of weather}. This accounts for
   * immunity to weather-based damage from the Pokemon's typing, abilities, and
   * other effects.
   * @param weather - The current {@linkcode Weather} on the field
   * @param pokemon - The {@linkcode Pokemon} to which damage may apply
   */
  private tryInflictWeatherDamage(weather: Weather, pokemon: Pokemon): void {
    if (!weather.isDamaging()) {
      return;
    }

    const cancelled = new BooleanHolder(false);

    applyAbAttrs<PreWeatherDamageAbAttr>(AbAttrFlag.PRE_WEATHER_DAMAGE, pokemon, false, weather, cancelled);
    applyAbAttrs<BlockNonDirectDamageAbAttr>(AbAttrFlag.BLOCK_NON_DIRECT_DAMAGE, pokemon, false, cancelled);

    if (
      cancelled.value
      || pokemon.getTypes(true, true).some((t) => weather.isTypeDamageImmune(t))
      || pokemon.getTag(BattlerTagType.UNDERGROUND, BattlerTagType.UNDERWATER)
      || pokemon.switchOutStatus
    ) {
      return;
    }

    const damage = toDmgValue(pokemon.getMaxHp() * WEATHER_DAMAGE_RATIO);

    globalScene.phaseManager.queueMessagePhase(getWeatherDamageMessage(weather.weatherType, pokemon) ?? "");
    pokemon.damageAndUpdate(damage, { result: HitResult.EFFECTIVE, preventEndure: true });
  }
}
