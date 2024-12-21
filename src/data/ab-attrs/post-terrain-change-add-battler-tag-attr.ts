import type { Pokemon } from "#app/field/pokemon";
import type { BattlerTagType } from "#enums/battler-tag-type";
import type { TerrainType } from "#enums/terrain-type";
import { PostTerrainChangeAbAttr } from "./post-terrain-change-ab-attr";

export class PostTerrainChangeAddBattlerTagAttr extends PostTerrainChangeAbAttr {
  private readonly tagType: BattlerTagType;
  private readonly turnCount: number;
  private readonly terrainTypes: TerrainType[];

  constructor(tagType: BattlerTagType, turnCount: number, ...terrainTypes: TerrainType[]) {
    super();

    this.tagType = tagType;
    this.turnCount = turnCount;
    this.terrainTypes = terrainTypes;
  }

  override applyPostTerrainChange(
    pokemon: Pokemon,
    _passive: boolean,
    simulated: boolean,
    terrain: TerrainType,
    _args: any[],
  ): boolean {
    if (!this.terrainTypes.find((t) => t === terrain)) {
      return false;
    }

    if (simulated) {
      return pokemon.canAddTag(this.tagType);
    } else {
      return pokemon.addTag(this.tagType, this.turnCount);
    }
  }
}
