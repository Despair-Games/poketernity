/** Alias for all {@linkcode ArenaEvent} type strings */
export enum ArenaEventType {
  /** Triggers when a {@linkcode WeatherType} is added, overlapped, or removed */
  WEATHER_CHANGED = "onWeatherChanged",
  /** Triggers when a {@linkcode TerrainType} is added, overlapped, or removed */
  TERRAIN_CHANGED = "onTerrainChanged",

  /** Triggers when a {@linkcode ArenaTagType} is added */
  TAG_ADDED = "onTagAdded",
  /** Triggers when a {@linkcode ArenaTagType} is removed */
  TAG_REMOVED = "onTagRemoved",
}
