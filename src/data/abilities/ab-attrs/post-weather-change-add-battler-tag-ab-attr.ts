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

  public override apply(pokemon: Pokemon, simulated: boolean, _weather: WeatherType): void {
    if (!simulated) {
      pokemon.addTag(this.tagType, this.turnCount);
    }
  }

  public override canApply(...[pokemon, , weather]: Parameters<this["apply"]>): boolean {
    return this.weatherTypes.includes(weather) && pokemon.canAddTag(this.tagType);
  }
}
