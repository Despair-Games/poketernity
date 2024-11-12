import Pokemon from "../field/pokemon";
import Move from "./move";
import { Type } from "#enums/type";
import { ProtectAttr } from "./move";
import { BattlerIndex } from "#app/battle";
import i18next from "i18next";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";

export enum TerrainType {
  NONE,
  MISTY,
  ELECTRIC,
  GRASSY,
  PSYCHIC
}

export class Terrain {
  public terrainType: TerrainType;
  public turnsLeft: integer;

  constructor(terrainType: TerrainType, turnsLeft?: integer) {
    this.terrainType = terrainType;
    this.turnsLeft = turnsLeft || 0;
  }

  lapse(): boolean {
    if (this.turnsLeft) {
      return !!--this.turnsLeft;
    }

    return true;
  }

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

  isMoveTerrainCancelled(user: Pokemon, targets: BattlerIndex[], move: Move): boolean {
    switch (this.terrainType) {
      case TerrainType.PSYCHIC:
        if (!move.hasAttr(ProtectAttr)) {
          // Cancels move if the move has positive priority and targets a Pokemon grounded on the Psychic Terrain
          return move.getPriority(user) > 0 && user.getOpponents().some(o => targets.includes(o.getBattlerIndex()) && o.isGrounded());
        }
    }

    return false;
  }
}

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


export function getTerrainColor(terrainType: TerrainType): [ integer, integer, integer ] {
  switch (terrainType) {
    case TerrainType.MISTY:
      return [ 232, 136, 200 ];
    case TerrainType.ELECTRIC:
      return [ 248, 248, 120 ];
    case TerrainType.GRASSY:
      return [ 120, 200, 80 ];
    case TerrainType.PSYCHIC:
      return [ 160, 64, 160 ];
  }

  return [ 0, 0, 0 ];
}

export function getTerrainFavoringTypes(terrainType: TerrainType): Type[] {
  switch (terrainType) {
    case TerrainType.ELECTRIC:
      return [ Type.ELECTRIC ];
    case TerrainType.GRASSY:
      return [ Type.GRASS ];
    case TerrainType.MISTY:
      // TODO: Does Fairy actually benefit enough from this terrain to be included?
      return [ Type.FAIRY ];
    case TerrainType.PSYCHIC:
      return [ Type.PSYCHIC ];
    default:
      return [];
  }
}

export function getTerrainFavoringAbilities(terrainType: TerrainType): Abilities[] {
  switch (terrainType) {
    case TerrainType.ELECTRIC:
      return [
        Abilities.SURGE_SURFER,
        Abilities.QUARK_DRIVE,
        Abilities.HADRON_ENGINE
      ];
    case TerrainType.GRASSY:
      return [ Abilities.GRASS_PELT ];
    case TerrainType.MISTY:
    case TerrainType.PSYCHIC:
    default:
      return [];
  }
}

export function getTerrainFavoringMoves(terrainType: TerrainType): Moves[] {
  switch (terrainType) {
    case TerrainType.ELECTRIC:
      return [
        Moves.RISING_VOLTAGE,
        Moves.PSYBLADE,
        Moves.TERRAIN_PULSE
      ];
    case TerrainType.GRASSY:
      return [
        Moves.GRASSY_GLIDE,
        Moves.FLORAL_HEALING,
        Moves.TERRAIN_PULSE
      ];
    case TerrainType.MISTY:
      return [
        Moves.MISTY_EXPLOSION,
        Moves.TERRAIN_PULSE
      ];
    case TerrainType.PSYCHIC:
      return [
        Moves.EXPANDING_FORCE,
        Moves.TERRAIN_PULSE
      ];
    default:
      return [];
  }
}
