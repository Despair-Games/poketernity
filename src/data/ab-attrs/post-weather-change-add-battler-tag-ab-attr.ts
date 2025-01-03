import type { Pokemon } from "#app/field/pokemon";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { WeatherType } from "#enums/weather-type";
import { PostWeatherChangeAbAttr } from "./post-weather-change-ab-attr";

export class PostWeatherChangeAddBattlerTagAttr extends PostWeatherChangeAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;
  private readonly weatherTypes: WeatherType[];

  constructor(tagType: BattlerTagType, turnCount: number, ...weatherTypes: WeatherType[]) {
    super();

    this.tagType = tagType;
    this.turnCount = turnCount;
    this.weatherTypes = weatherTypes;
  }

  override applyPostWeatherChange(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    weather: WeatherType,
    _args: any[],
  ): boolean {
    if (!this.weatherTypes.find((w) => weather === w)) {
      return false;
    }

    if (simulated) {
      return pokemon.canAddTag(this.tagType);
    } else {
      return pokemon.addTag(this.tagType, this.turnCount);
    }
  }
}
