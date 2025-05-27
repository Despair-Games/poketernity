import type { BattlerTag } from "#battler-tags/battler-tag";
import { HighestStatBoostTag } from "#battler-tags/highest-stat-boost-tag";
import type { TerrainBattlerTag } from "#battler-tags/terrain-battler-tag";
import type { AbilityId } from "#enums/ability-id";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { TerrainType } from "#enums/terrain-type";

/**
 * Tag representing the stat boost from an ability
 * (i.e. {@link https://bulbapedia.bulbagarden.net/wiki/Quark_Drive_(Ability) | Quark Drive})
 * while a given {@linkcode TerrainType | terrain} is active.
 * @extends HighestStatBoostTag
 */
export class TerrainHighestStatBoostTag extends HighestStatBoostTag implements TerrainBattlerTag {
  public terrainTypes: TerrainType[];

  constructor(tagType: BattlerTagType, ability: AbilityId, ...terrainTypes: TerrainType[]) {
    super(tagType, ability);
    this.terrainTypes = terrainTypes;
  }

  /**
   * When given a battler tag or json representing one, load the data for it.
   * @param source A battler tag
   */
  override loadTag(source: BattlerTag | any): void {
    super.loadTag(source);
    this.terrainTypes = source.terrainTypes.map((w) => w as TerrainType);
  }
}
