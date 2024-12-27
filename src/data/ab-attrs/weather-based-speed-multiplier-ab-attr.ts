import { StatMultiplierAbAttr } from "./stat-multiplier-ab-attr";
import type { WeatherType } from "#enums/weather-type";
import type { BattleStat } from "#enums/stat";
import { Stat } from "#enums/stat";
import type { Pokemon } from "#app/field/pokemon";
import type { NumberHolder } from "#app/utils";
import { getWeatherCondition } from "../abilities";

export class WeatherBasedSpeedMultiplierAbAttr extends StatMultiplierAbAttr {
  private weather: WeatherType[] = [];

  constructor(weather: WeatherType | WeatherType[]) {
    super(Stat.SPD, 2);
    this.weather = this.weather.concat(weather);
  }

  override applyStatStage(
    pokemon: Pokemon,
    passive: boolean,
    simulated: boolean,
    stat: BattleStat,
    statValue: NumberHolder,
    args: any[],
  ): boolean {
    if (getWeatherCondition(...this.weather)) {
      return super.applyStatStage(pokemon, passive, simulated, stat, statValue, args);
    }
    return false;
  }
}
