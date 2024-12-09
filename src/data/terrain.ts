import type Pokemon from "../field/pokemon";
import type Move from "./move";
import { Type } from "#enums/type";
import { ProtectAttr } from "./move";
import type { BattlerIndex } from "#app/battle";
import i18next from "i18next";
import { getPokemonNameWithAffix } from "#app/messages";

export enum TerrainType {
  NONE,
  MISTY,
  ELECTRIC,
  GRASSY,
  PSYCHIC,
}

/**
 * Class representing Terrain effects
 * @var weatherType - The TerrainType that is being represented
 * @var turnsLeft - How many turns the terrain still has left
 */
export class Terrain {
  public terrainType: TerrainType;
  public turnsLeft: integer;

  constructor(terrainType: TerrainType, turnsLeft?: integer) {
    this.terrainType = terrainType;
    this.turnsLeft = turnsLeft || 0;
  }

  /**
   * Decrements turnsLeft and checks if it is greater than 0
   * @returns true if turnsLeft is greater than 0
   */
  lapse(): boolean {
    if (this.turnsLeft) {
      return !!--this.turnsLeft;
    }

    return true;
  }

  /**
   * Function to return a multiplier for specific types
   * Electric, Grassy, and Psychic give their corresponding types 30% boost
   * @param attackType - the Attacking Type
   * @returns a multiplier (1.3 or 1)
   */
  getAttackTypeMultiplier(attackType: Type): number {
    switch (this.terrainType) {
      case TerrainType.ELECTRIC:
        if (attackType === Type.ELECTRIC) {
          return 1.3;
        }
        break;
      case TerrainType.GRASSY:
        if (attackType === Type.GRASS) {
          return 1.3;
        }
        break;
      case TerrainType.PSYCHIC:
        if (attackType === Type.PSYCHIC) {
          return 1.3;
        }
        break;
    }

    return 1;
  }

  /**
   * Checks if the weather should cancel the move
   * Psychic terrain cancels positive priority moves that target grounded Pokemon
   * @param user - The attacker
   * @param targets - The targets
   * @param move - The move being used
   * @returns true if the move is cancelled, false otherwise
   */
  isMoveTerrainCancelled(user: Pokemon, targets: BattlerIndex[], move: Move): boolean {
    switch (this.terrainType) {
      case TerrainType.PSYCHIC:
        if (!move.hasAttr(ProtectAttr)) {
          // Cancels move if the move has positive priority and targets a Pokemon grounded on the Psychic Terrain
          return (
            move.getPriority(user) > 0
            && user.getOpponents().some((o) => targets.includes(o.getBattlerIndex()) && o.isGrounded())
          );
        }
    }

    return false;
  }
}

/**
 * Function to get the name for a TerrainType
 * @param terrainType - The terrainType
 * @returns the associated string
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
 * Function to get an RGB representation for a TerrainType
 * TODO: we should either be using hex or RGB, not a mix
 * @param terrainType - The terrainType
 * @returns the associated RGB list of 3 numbers
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
 * @param terrainType - the terrainType starting
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
 * @param terrainType - the terrainType ending
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
 * @param pokemon - The Pokemon using the move
 * @param terrainType - the Terrain type (misty terrain has a unique message)
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
