/** biome-ignore-all lint/style/noNestedTernary: modified in another PR */

import type { ArenaTag } from "#arena-tags/arena-tag";
import { loadArenaTag } from "#arena-tags/utils/load-arena-tag";
import { Terrain } from "#data/terrain";
import { Weather } from "#data/weather";
import type { BiomeId } from "#enums/biome-id";
import { Arena } from "#field/arena";
import { isNil } from "#utils/common-utils";

export class ArenaData {
  public biome: BiomeId;
  public weather: Weather | null;
  public terrain: Terrain | null;
  public tags: ArenaTag[];

  constructor(source: Arena | any) {
    const sourceArena = source instanceof Arena ? (source as Arena) : null;
    this.biome = sourceArena ? sourceArena.biomeId : source.biome;
    this.weather = sourceArena
      ? sourceArena.weather
      : source.weather
        ? new Weather(source.weather.weatherType, source.weather.turnsLeft)
        : null;
    this.terrain = sourceArena
      ? sourceArena.terrain
      : source.terrain
        ? new Terrain(source.terrain.terrainType, source.terrain.turnsLeft)
        : null;
    this.tags = [];

    if (source.tags) {
      this.tags = (source.tags as ArenaTag[]).map((t) => loadArenaTag(t)).filter((t) => !isNil(t));
    }
  }
}
