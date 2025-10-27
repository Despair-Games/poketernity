import type { BattlerTag } from "#battler-tags/battler-tag";
import { HighestStatBoostTag } from "#battler-tags/highest-stat-boost-tag";
import type { WeatherBattlerTag } from "#battler-tags/weather-battler-tag";
import type { AbilityId } from "#enums/ability-id";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { WeatherType } from "#enums/weather-type";
import type { Mutable, NonEmptyArray } from "#types/utility-types";

/**
 * Tag representing the stat boost from an ability
 * (i.e. {@link https://bulbapedia.bulbagarden.net/wiki/Protosynthesis_(Ability) | Protosynthesis})
 * while a given {@linkcode WeatherType | weather} is active.
 */
export class WeatherHighestStatBoostTag extends HighestStatBoostTag implements WeatherBattlerTag {
  public readonly weatherTypes: Readonly<NonEmptyArray<WeatherType>>;

  constructor(tagType: BattlerTagType, ability: AbilityId, ...weatherTypes: Readonly<NonEmptyArray<WeatherType>>) {
    super(tagType, ability);
    this.weatherTypes = weatherTypes;
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    (this as Mutable<this>).weatherTypes = source.weatherTypes.map((w) => w as WeatherType);
  }
}
