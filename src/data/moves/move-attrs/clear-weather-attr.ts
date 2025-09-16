import { globalScene } from "#app/global-scene";
import { WeatherType } from "#enums/weather-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";

/**
 * Attribute to clear active weather of a given type from the field.
 * Used for {@link https://bulbapedia.bulbagarden.net/wiki/Defog_(move) | Defog}.
 */
export class ClearWeatherAttr extends MoveEffectAttr {
  private readonly weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super();

    this.weatherType = weatherType;
  }

  override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    if (globalScene.arena.hasWeather(this.weatherType)) {
      return globalScene.arena.trySetWeather(WeatherType.NONE, true);
    }

    return false;
  }

  /**
   * @returns The opposite of the perceived combined {@linkcode Pokemon.getWeatherBenefitScore | benefit}
   * from the weather to remove. If this attribute's weather type isn't active, this
   * grants (+0) instead.
   *
   * @privateRemarks
   * This doesn't do anything for Defog since no benefit is assigned to Fog for any
   * type, move, or ability. However, this allows for the attribute to be scored
   * if it is ever reused to target different weather types.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    if (!globalScene.arena.hasWeather(this.weatherType)) {
      return 0;
    }

    return Math.floor(
      user
        .getParty()
        .filter((p) => p.isAllowedInBattle())
        .reduce((score, p) => score - p.getWeatherBenefitScore(this.weatherType), 0),
    );
  }
}
