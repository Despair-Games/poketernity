import { allMoves } from "#app/data/data-lists";
import type { Move } from "#app/data/move";
import { CallMoveAttr } from "#app/data/move-attrs/call-move-attr";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BooleanHolder } from "#app/utils";
import { Biome } from "#enums/biome";
import { MoveId } from "#enums/move-id";
import { TerrainType } from "#enums/terrain-type";

/**
 * Attribute to invoke another move based on the current biome
 * (or terrain, if one is on the field).
 * Used by {@link https://bulbapedia.bulbagarden.net/wiki/Nature_Power_(move) | Nature Power}.
 * @extends CallMoveAttr
 */
export class NaturePowerAttr extends CallMoveAttr {
  constructor() {
    super();
    this.hasTarget = true;
  }

  override apply(user: Pokemon, target: Pokemon, _move: Move, overridden: BooleanHolder): boolean {
    let moveId: MoveId;
    const getBiomeMoveId = (): MoveId => {
      switch (globalScene.arena.biomeType) {
        case Biome.TOWN:
          return MoveId.ROUND;
        case Biome.METROPOLIS:
          return MoveId.TRI_ATTACK;
        case Biome.SLUM:
          return MoveId.SLUDGE_BOMB;
        case Biome.PLAINS:
          return MoveId.SILVER_WIND;
        case Biome.GRASS:
          return MoveId.GRASS_KNOT;
        case Biome.TALL_GRASS:
          return MoveId.POLLEN_PUFF;
        case Biome.MEADOW:
          return MoveId.GIGA_DRAIN;
        case Biome.FOREST:
          return MoveId.BUG_BUZZ;
        case Biome.JUNGLE:
          return MoveId.LEAF_STORM;
        case Biome.SEA:
          return MoveId.HYDRO_PUMP;
        case Biome.SWAMP:
          return MoveId.MUD_BOMB;
        case Biome.BEACH:
          return MoveId.SCALD;
        case Biome.LAKE:
          return MoveId.BUBBLE_BEAM;
        case Biome.SEABED:
          return MoveId.BRINE;
        case Biome.ISLAND:
          return MoveId.LEAF_TORNADO;
        case Biome.MOUNTAIN:
          return MoveId.AIR_SLASH;
        case Biome.BADLANDS:
          return MoveId.EARTH_POWER;
        case Biome.DESERT:
          return MoveId.SCORCHING_SANDS;
        case Biome.WASTELAND:
          return MoveId.DRAGON_PULSE;
        case Biome.CONSTRUCTION_SITE:
          return MoveId.STEEL_BEAM;
        case Biome.CAVE:
          return MoveId.POWER_GEM;
        case Biome.ICE_CAVE:
          return MoveId.ICE_BEAM;
        case Biome.SNOWY_FOREST:
          return MoveId.FROST_BREATH;
        case Biome.VOLCANO:
          return MoveId.LAVA_PLUME;
        case Biome.GRAVEYARD:
          return MoveId.SHADOW_BALL;
        case Biome.RUINS:
          return MoveId.ANCIENT_POWER;
        case Biome.TEMPLE:
          return MoveId.EXTRASENSORY;
        case Biome.DOJO:
          return MoveId.FOCUS_BLAST;
        case Biome.FAIRY_CAVE:
          return MoveId.ALLURING_VOICE;
        case Biome.ABYSS:
          return MoveId.OMINOUS_WIND;
        case Biome.SPACE:
          return MoveId.DRACO_METEOR;
        case Biome.FACTORY:
          return MoveId.FLASH_CANNON;
        case Biome.LABORATORY:
          return MoveId.ZAP_CANNON;
        case Biome.POWER_PLANT:
          return MoveId.CHARGE_BEAM;
        case Biome.END:
          return MoveId.ETERNABEAM;
      }
    };
    switch (globalScene.arena.getTerrainType()) {
      // terrain takes priority over biome
      case TerrainType.NONE:
        moveId = getBiomeMoveId();
        break;
      case TerrainType.MISTY:
        moveId = MoveId.MOONBLAST;
        break;
      case TerrainType.ELECTRIC:
        moveId = MoveId.THUNDERBOLT;
        break;
      case TerrainType.GRASSY:
        moveId = MoveId.ENERGY_BALL;
        break;
      case TerrainType.PSYCHIC:
        moveId = MoveId.PSYCHIC;
        break;
      default:
        moveId = MoveId.TRI_ATTACK;
        break;
    }

    return super.apply(user, target, allMoves.get(moveId), overridden);
  }
}
