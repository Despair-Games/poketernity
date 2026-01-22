import { PostWeatherChangeAbAttr } from "#abilities/post-weather-change-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { WeatherType } from "#enums/weather-type";
import type { PostWeatherChangeAbAttrParams } from "#types/ab-attr-param-types";
import type { NonEmptyArray } from "#types/utility-types";

export class PostWeatherChangeAddBattlerTagAbAttr extends PostWeatherChangeAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;
  private readonly weatherTypes: Readonly<NonEmptyArray<WeatherType>>;

  constructor(tagType: BattlerTagType, turnCount: number, ...weatherTypes: Readonly<NonEmptyArray<WeatherType>>) {
    super();

    this.tagType = tagType;
    this.turnCount = turnCount;
    this.weatherTypes = weatherTypes;
  }

  public override apply({ pokemon, simulated }: PostWeatherChangeAbAttrParams): void {
    if (!simulated) {
      pokemon.addTag(this.tagType, this.turnCount);
    }
  }

  public override canApply({ pokemon, weather }: Parameters<this["apply"]>[0]): boolean {
    return this.weatherTypes.includes(weather) && pokemon.canAddTag(this.tagType);
  }
}
