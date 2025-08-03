import type { EnumValues } from "#types/utility-types";

/** Alias for all {@linkcode ArenaEvent} type strings */
export const ArenaEventType = {
  /** Triggers when a {@linkcode WeatherType} is added, overlapped, or removed */
  WEATHER_CHANGED: "onWeatherChanged",
  /** Triggers when a {@linkcode TerrainType} is added, overlapped, or removed */
  TERRAIN_CHANGED: "onTerrainChanged",

  /** Triggers when an {@linkcode ArenaTagType} is added */
  TAG_ADDED: "onTagAdded",
  /** Triggers when an {@linkcode ArenaTagType} is removed */
  TAG_REMOVED: "onTagRemoved",
} as const;

export type ArenaEventType = EnumValues<typeof ArenaEventType>;
