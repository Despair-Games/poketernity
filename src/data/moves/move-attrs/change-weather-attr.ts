import { globalScene } from "#app/global-scene";
import { SOFT_EFFECT_SCORE_LIMIT } from "#constants/ai-constants";
import { WeatherType } from "#enums/weather-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { MoveEffectAttr } from "#moves/move-effect-attr";
import type { MoveConditionFunc } from "#types/move-types";

/**
 * Attribute to set weather of a specified type on the field.
 */
export class ChangeWeatherAttr extends MoveEffectAttr {
  private readonly weatherType: WeatherType;

  constructor(weatherType: WeatherType) {
    super(true);

    this.weatherType = weatherType;
  }

  public override applyEffect(_user: Pokemon, _target: Pokemon, _move: Move): boolean {
    return globalScene.arena.trySetWeather(this.weatherType, true);
  }

  public override getCondition(): MoveConditionFunc {
    return (_user, _target, _move) => globalScene.arena.canSetWeather(this.weatherType);
  }

  /**
   * @returns An Effect Score based on how much the user's non-fainted party benefits
   * from the Weather to set compared to the opponents' benefit.
   */
  public override getEffectScore(user: EnemyPokemon, _target: Pokemon, _move: Move): number {
    const currentWeather = globalScene.arena.weather?.weatherType ?? WeatherType.NONE;

    const userBenefit = user
      .getParty()
      .filter((p) => p.isAllowedInBattle())
      .reduce(
        (score, p) => score + p.getWeatherBenefitScore(this.weatherType) - p.getWeatherBenefitScore(currentWeather),
        0,
      );

    const oppBenefit = user
      .getOpposingParty()
      .filter((p) => p.isAllowedInBattle())
      .reduce(
        (score, p) =>
          score + p.getWeatherBenefitScore(this.weatherType, true) - p.getWeatherBenefitScore(currentWeather, true),
        0,
      );

    const rawScore = userBenefit - oppBenefit;
    const minScore = Math.floor(rawScore);
    const tierUpChance = Math.floor((rawScore - minScore) * 100);

    return Math.min(this.getRandomScore(user, tierUpChance, minScore + 1, minScore), SOFT_EFFECT_SCORE_LIMIT);
  }
}
