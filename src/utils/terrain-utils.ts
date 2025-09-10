import { getPokemonNameWithAffix } from "#app/messages";
import {
  ELECTRIC_TERRAIN_SYNERGY_MOVES,
  GRASSY_TERRAIN_SYNERGY_MOVES,
  MISTY_TERRAIN_SYNERGY_MOVES,
  PSYCHIC_TERRAIN_SYNERGY_MOVES,
} from "#constants/move-constants";
import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#field/pokemon";
import i18next from "i18next";

/**
 * Get the name for a given terrain type
 * @param terrainType - The {@linkcode TerrainType}
 * @returns the associated name, or an empty string if there is none
 */
export function getTerrainName(terrainType: TerrainType): string {
  switch (terrainType) {
    case TerrainType.MISTY:
      return i18next.t("terrain:misty");
    case TerrainType.ELECTRIC:
      return i18next.t("terrain:electric");
    case TerrainType.GRASSY:
      return i18next.t("terrain:grassy");
    case TerrainType.PSYCHIC:
      return i18next.t("terrain:psychic");
  }

  return "";
}

/**
 * Function to get an RGB representation for a {@linkcode TerrainType}
 * TODO: we should either be using hex or RGB, not a mix
 * @param terrainType - The {@linkcode TerrainType}
 * @returns the associated RGB array of 3 numbers
 */
export function getTerrainColor(terrainType: TerrainType): [number, number, number] {
  switch (terrainType) {
    case TerrainType.MISTY:
      return [232, 136, 200]; // Pink
    case TerrainType.ELECTRIC:
      return [248, 248, 120]; // Yellow
    case TerrainType.GRASSY:
      return [120, 200, 80]; // Green
    case TerrainType.PSYCHIC:
      return [160, 64, 160]; // Purple
  }

  return [0, 0, 0];
}

/**
 * Function to get the starting message for a terrain
 * @param terrainType - the {@linkcode TerrainType} starting
 * @returns the associated string
 */
export function getTerrainStartMessage(terrainType: TerrainType): string | null {
  switch (terrainType) {
    case TerrainType.MISTY:
      return i18next.t("terrain:mistyStartMessage");
    case TerrainType.ELECTRIC:
      return i18next.t("terrain:electricStartMessage");
    case TerrainType.GRASSY:
      return i18next.t("terrain:grassyStartMessage");
    case TerrainType.PSYCHIC:
      return i18next.t("terrain:psychicStartMessage");
    default:
      console.warn("getTerrainStartMessage not defined. Using default null");
      return null;
  }
}

/**
 * Function to get the ending message for a terrain
 * @param terrainType - the {@linkcode TerrainType} ending
 * @returns the associated string
 */
export function getTerrainClearMessage(terrainType: TerrainType): string | null {
  switch (terrainType) {
    case TerrainType.MISTY:
      return i18next.t("terrain:mistyClearMessage");
    case TerrainType.ELECTRIC:
      return i18next.t("terrain:electricClearMessage");
    case TerrainType.GRASSY:
      return i18next.t("terrain:grassyClearMessage");
    case TerrainType.PSYCHIC:
      return i18next.t("terrain:psychicClearMessage");
    default:
      console.warn("getTerrainClearMessage not defined. Using default null");
      return null;
  }
}

/**
 * Function to get the message for when a terrain blocks a move
 * @param pokemon - The Pokemon being attacked
 * @param terrainType - the {@linkcode TerrainType} (misty terrain has a unique message)
 * @returns the associated string
 */
export function getTerrainBlockMessage(pokemon: Pokemon, terrainType: TerrainType): string {
  if (terrainType === TerrainType.MISTY) {
    return i18next.t("terrain:mistyBlockMessage", { pokemonNameWithAffix: getPokemonNameWithAffix(pokemon) });
  }
  return i18next.t("terrain:defaultBlockMessage", {
    pokemonNameWithAffix: getPokemonNameWithAffix(pokemon),
    terrainName: getTerrainName(terrainType),
  });
}

export function getTerrainTypeSynergyScore(terrainType: TerrainType, elementalType: ElementalType): number {
  switch (terrainType) {
    case TerrainType.MISTY:
      return elementalType === ElementalType.DRAGON ? -1 : 0;
    case TerrainType.ELECTRIC:
      return elementalType === ElementalType.ELECTRIC ? 1 : 0;
    case TerrainType.GRASSY:
      return elementalType === ElementalType.GRASS ? 1 : 0;
    case TerrainType.PSYCHIC:
      return elementalType === ElementalType.PSYCHIC ? 1 : 0;
    default: {
      terrainType satisfies TerrainType.NONE;
      return 0;
    }
  }
}

/**
 * @param terrainType - The {@linkcode TerrainType} to check
 * @returns A set of {@link AbilityId | IDs} for abilities that benefit from
 * the given terrain type
 */
export function getTerrainSynergyAbilities(terrainType: TerrainType): ReadonlySet<AbilityId> {
  switch (terrainType) {
    case TerrainType.ELECTRIC:
      return new Set([AbilityId.QUARK_DRIVE, AbilityId.SURGE_SURFER, AbilityId.HADRON_ENGINE]);
    case TerrainType.GRASSY:
      return new Set([AbilityId.GRASS_PELT]);
    default:
      return new Set([]);
  }
}

/**
 * @param terrainType - The {@linkcode TerrainType} to check
 * @returns An array of {@link MoveId | IDs} for moves that benefit from
 * the given terrain type
 */
export function getTerrainSynergyMoves(terrainType: TerrainType): readonly MoveId[] {
  switch (terrainType) {
    case TerrainType.MISTY:
      return MISTY_TERRAIN_SYNERGY_MOVES;
    case TerrainType.ELECTRIC:
      return ELECTRIC_TERRAIN_SYNERGY_MOVES;
    case TerrainType.GRASSY:
      return GRASSY_TERRAIN_SYNERGY_MOVES;
    case TerrainType.PSYCHIC:
      return PSYCHIC_TERRAIN_SYNERGY_MOVES;
    default:
      return [];
  }
}
