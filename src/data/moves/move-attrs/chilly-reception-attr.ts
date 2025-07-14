import { globalScene } from "#app/global-scene";
import { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import { ForceSwitchOutAttr } from "#moves/force-switch-out-attr";
import type { Move } from "#moves/move";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Attribute to set the weather to Snow, then
 * attempt a forced switch on the user.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Chilly_Reception_(move) | Chilly Reception}.
 */
export class ChillyReceptionAttr extends ForceSwitchOutAttr {
  override apply(user: Pokemon, target: Pokemon, move: Move): boolean {
    globalScene.arena.trySetWeather(WeatherType.SNOW, true);
    return super.apply(user, target, move);
  }

  override getCondition(): MoveConditionFunc {
    // chilly reception move will go through if the weather is change-able to snow, or the user can switch out, else move will fail
    return (user, target, move) =>
      !globalScene.arena.hasWeather(WeatherType.SNOW) || super.getSwitchOutCondition()(user, target, move);
  }
}
