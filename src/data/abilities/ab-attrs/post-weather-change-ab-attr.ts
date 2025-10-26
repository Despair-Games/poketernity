import { AbAttr } from "#abilities/ab-attr";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";

export abstract class PostWeatherChangeAbAttr extends AbAttr {
  protected override readonly abAttrKey = "PostWeatherChangeAbAttr";

  constructor() {
    super(true);
  }

  /**
   * Applies an effect after the weather on the field changes
   * @param pokemon The {@linkcode Pokemon} with this ability
   * @param simulated If `true`, suppresses changes to game state
   * @param weather The {@linkcode Weather} being set on the field
   */
  public abstract override apply(_pokemon: Pokemon, _simulated: boolean, _weather: WeatherType): void;
}
