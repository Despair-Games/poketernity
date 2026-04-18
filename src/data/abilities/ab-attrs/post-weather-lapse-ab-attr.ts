import { AbAttr } from "#abilities/ab-attr";
import type { WeatherType } from "#enums/weather-type";
import type { BaseAbAttrParams } from "#types/ab-attr-param-types";
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

  public abstract override apply(params: BaseAbAttrParams): void;

  public override getCondition(): AbAttrCondition {
    return getWeatherCondition(...this.weatherTypes);
  }
}
