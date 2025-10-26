import { AbAttr } from "#abilities/ab-attr";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";
import type { AbAttrCondition } from "#types/ability-types";
import type { NonEmptyArray } from "#types/utility-types";
import { getWeatherCondition } from "#utils/ability-utils";

export abstract class PostWeatherLapseAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostWeatherLapseAbAttr";
  protected readonly weatherTypes: Readonly<NonEmptyArray<WeatherType>>;

  constructor(...weatherTypes: Readonly<NonEmptyArray<WeatherType>>) {
    super(true);

    this.weatherTypes = weatherTypes;
  }

  /**
   * Applies an effect after the weather on the field lapses.
   * @param pokemon - The {@linkcode Pokemon} with this ability
   * @param simulated - If `true`, suppresses changes to game state
   * @returns `true` if effects successfully apply
   */
  public abstract override apply(_pokemon: Pokemon, _simulated: boolean): void;

  public override getCondition(): AbAttrCondition {
    return getWeatherCondition(...this.weatherTypes);
  }
}
