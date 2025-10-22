import { PostTerrainChangeAbAttr } from "#abilities/post-terrain-change-ab-attr";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";

export class PostTerrainChangeAddBattlerTagAbAttr extends PostTerrainChangeAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;
  private readonly terrainTypes: TerrainType[];

  constructor(tagType: BattlerTagType, turnCount: number, ...terrainTypes: TerrainType[]) {
    super();

    this.tagType = tagType;
    this.turnCount = turnCount;
    this.terrainTypes = terrainTypes;
  }

  public override apply(pokemon: Pokemon, simulated: boolean, _terrain: TerrainType): void {
    if (!simulated) {
      pokemon.addTag(this.tagType, this.turnCount);
    }
  }

  public override canApply(...[pokemon, , terrain]: Parameters<this["apply"]>): boolean {
    return this.terrainTypes.includes(terrain) && pokemon.canAddTag(this.tagType);
  }
}
