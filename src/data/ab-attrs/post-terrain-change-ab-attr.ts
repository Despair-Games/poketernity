import type { Pokemon } from "#app/field/pokemon";
import type { TerrainType } from "#enums/terrain-type";
import { AbAttr } from "./ab-attr";

export class PostTerrainChangeAbAttr extends AbAttr {
  applyPostTerrainChange(
    _pokemon: Pokemon,
    _passive: boolean,
    _simulated: boolean,
    _terrain: TerrainType,
    _args: any[],
  ): boolean {
    return false;
  }
}
