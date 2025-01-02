import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { Move } from "#app/data/move";
import { ForceSwitchOutAttr } from "#app/data/move-attrs/force-switch-out-attr";
import type { MoveConditionFunc } from "../move-conditions";

/**
 * Attribute to set the weather to Snow, then
 * attempt a forced switch on the user.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Chilly_Reception_(move) Chilly Reception}.
 * @extends ForceSwitchOutAttr
 */
export class ChillyReceptionAttr extends ForceSwitchOutAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    globalScene.arena.trySetWeather(WeatherType.SNOW, true);
    return super.apply(user, target, move);
  }

  override getCondition(): MoveConditionFunc {
    // chilly reception move will go through if the weather is change-able to snow, or the user can switch out, else move will fail
    return (user, target, move) =>
      globalScene.arena.weather?.weatherType !== WeatherType.SNOW || super.getSwitchOutCondition()(user, target, move);
  }
}
