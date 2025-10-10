import type { Terrain } from "#data/terrain";
import type { Weather } from "#data/weather";
import type { BiomeId } from "#enums/biome-id";
import type { TerrainType } from "#enums/terrain-type";
import type { WeatherType } from "#enums/weather-type";
import type { ArenaTagData } from "#types/arena-tag-types";
import type { NonFunctionProperties } from "#types/utility-types";

export interface SerializedTerrain {
  terrainType: TerrainType;
  turnsLeft: number;
}

export interface SerializedWeather {
  weatherType: WeatherType;
  turnsLeft: number;
}

export interface SerializedArenaData {
  biomeId: BiomeId;
  weather: NonFunctionProperties<Weather> | null;
  terrain: NonFunctionProperties<Terrain> | null;
  tags?: ArenaTagData[];
}
