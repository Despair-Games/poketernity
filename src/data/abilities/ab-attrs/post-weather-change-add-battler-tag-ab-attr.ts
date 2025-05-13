import { PostWeatherChangeAbAttr } from "#abilities/post-weather-change-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { WeatherType } from "#enums/weather-type";
import type { Pokemon } from "#field/pokemon";

export class PostWeatherChangeAddBattlerTagAbAttr extends PostWeatherChangeAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;
  private readonly weatherTypes: WeatherType[];

  constructor(tagType: BattlerTagType, turnCount: number, ...weatherTypes: WeatherType[]) {
    super();

    this.tagType = tagType;
    this.turnCount = turnCount;
    this.weatherTypes = weatherTypes;
  }

  override apply(pokemon: Pokemon, simulated: boolean, weather: WeatherType): boolean {
    if (!this.weatherTypes.find((w) => weather === w)) {
      return false;
    }

    if (simulated) {
      return pokemon.canAddTag(this.tagType);
    }
    return pokemon.addTag(this.tagType, this.turnCount);
  }
}
