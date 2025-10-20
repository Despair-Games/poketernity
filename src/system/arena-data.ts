import { type ArenaTag, SerializableArenaTag } from "#arena-tags/arena-tag";
import { loadArenaTag } from "#arena-tags/utils/load-arena-tag";
import { Terrain } from "#data/terrain";
import { Weather } from "#data/weather";
import type { BiomeId } from "#enums/biome-id";
import { Arena } from "#field/arena";
import type { ArenaTagData } from "#types/arena-tag-types";
import type { SerializedArenaData } from "#types/arena-types";

export class ArenaData {
  public biomeId: BiomeId;
  public weather: Weather | null;
  public terrain: Terrain | null;
  public tags: ArenaTag[];

  constructor(source: Arena | SerializedArenaData) {
    // Exclude any unserializable tags from the serialized data (such as ones only lasting 1 turn).
    // NOTE: The filter has to be done _after_ map, data loaded from `ArenaTagTypeData`
    // is not yet an instance of `ArenaTag`
    this.tags =
      source.tags
        ?.map((t: ArenaTag | ArenaTagData) => loadArenaTag(t))
        ?.filter((tag): tag is SerializableArenaTag => tag instanceof SerializableArenaTag) ?? [];

    if (source instanceof Arena) {
      this.biomeId = source.biomeId;
      this.weather = source.weather;
      this.terrain = source.terrain;
      return;
    }

    this.biomeId = source.biomeId ?? source["biome"]; // `??` is temporary to support older dev saves; TODO: remove later
    this.weather = source.weather ? new Weather(source.weather.weatherType, source.weather.turnsLeft) : null;
    this.terrain = source.terrain ? new Terrain(source.terrain.terrainType, source.terrain.turnsLeft) : null;
  }
}
