import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { HealAttr } from "#app/data/move-attrs/heal-attr";

export abstract class WeatherHealAttr extends HealAttr {
  constructor() {
    super(0.5);
  }

  override apply(user: Pokemon, _target: Pokemon, _move: Move): boolean {
    let healRatio = 0.5;
    if (!globalScene.arena.weather?.isEffectSuppressed()) {
      const weatherType = globalScene.arena.weather?.weatherType || WeatherType.NONE;
      healRatio = this.getWeatherHealRatio(weatherType);
    }
    this.addHealPhase(user, healRatio);
    return true;
  }

  abstract getWeatherHealRatio(weatherType: WeatherType): number;
}
