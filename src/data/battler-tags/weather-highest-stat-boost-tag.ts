import type { BattlerTag } from "#app/data/battler-tags/battler-tag";
import { HighestStatBoostTag } from "#app/data/battler-tags/highest-stat-boost-tag";
import type { WeatherBattlerTag } from "#app/data/battler-tags/weather-battler-tag";
import type { Abilities } from "#enums/abilities";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { WeatherType } from "#enums/weather-type";

/**
 * Tag representing the stat boost from an ability
 * (i.e. {@link https://bulbapedia.bulbagarden.net/wiki/Protosynthesis_(Ability) | Protosynthesis})
 * while a given {@linkcode WeatherType | weather} is active.
 * @extends HighestStatBoostTag
 * @implements `WeatherBattlerTag`
 */
export class WeatherHighestStatBoostTag extends HighestStatBoostTag implements WeatherBattlerTag {
  public weatherTypes: WeatherType[];

  constructor(tagType: BattlerTagType, ability: Abilities, ...weatherTypes: WeatherType[]) {
    super(tagType, ability);
    this.weatherTypes = weatherTypes;
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.weatherTypes = source.weatherTypes.map((w) => w as WeatherType);
  }
}
