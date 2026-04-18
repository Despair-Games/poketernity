import { PostTerrainChangeAbAttr } from "#abilities/post-terrain-change-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { TerrainType } from "#enums/terrain-type";
import type { PostTerrainChangeAbAttrParams } from "#types/ab-attr-param-types";
import type { NonEmptyArray } from "#types/utility-types";

export class PostTerrainChangeAddBattlerTagAbAttr extends PostTerrainChangeAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;
  private readonly terrainTypes: Readonly<NonEmptyArray<TerrainType>>;

  constructor(tagType: BattlerTagType, turnCount: number, ...terrainTypes: Readonly<NonEmptyArray<TerrainType>>) {
    super();

    this.tagType = tagType;
    this.turnCount = turnCount;
    this.terrainTypes = terrainTypes;
  }

  public override apply({ pokemon, simulated }: PostTerrainChangeAbAttrParams): void {
    if (!simulated) {
      pokemon.addTag(this.tagType, this.turnCount);
    }
  }

  public override canApply({ pokemon, terrain }: Parameters<this["apply"]>[0]): boolean {
    return this.terrainTypes.includes(terrain) && pokemon.canAddTag(this.tagType);
  }
}
