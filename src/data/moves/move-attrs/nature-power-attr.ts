import { allMoves } from "#app/data/data-lists";
import type { Move } from "#app/data/moves/move";
import { CallMoveAttr } from "#app/data/moves/move-attrs/call-move-attr";
import { type Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import type { BooleanHolder } from "#app/utils";
import { BiomeId } from "#enums/biome-id";
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
      switch (globalScene.arena.biomeId) {
        case BiomeId.TOWN:
          return MoveId.ROUND;
        case BiomeId.METROPOLIS:
          return MoveId.TRI_ATTACK;
        case BiomeId.SLUM:
          return MoveId.SLUDGE_BOMB;
        case BiomeId.PLAINS:
          return MoveId.SILVER_WIND;
        case BiomeId.GRASS:
          return MoveId.GRASS_KNOT;
        case BiomeId.TALL_GRASS:
          return MoveId.POLLEN_PUFF;
        case BiomeId.MEADOW:
          return MoveId.GIGA_DRAIN;
        case BiomeId.FOREST:
          return MoveId.BUG_BUZZ;
        case BiomeId.JUNGLE:
          return MoveId.LEAF_STORM;
        case BiomeId.SEA:
          return MoveId.HYDRO_PUMP;
        case BiomeId.SWAMP:
          return MoveId.MUD_BOMB;
        case BiomeId.BEACH:
          return MoveId.SCALD;
        case BiomeId.LAKE:
          return MoveId.BUBBLE_BEAM;
        case BiomeId.SEABED:
          return MoveId.BRINE;
        case BiomeId.ISLAND:
          return MoveId.LEAF_TORNADO;
        case BiomeId.MOUNTAIN:
          return MoveId.AIR_SLASH;
        case BiomeId.BADLANDS:
          return MoveId.EARTH_POWER;
        case BiomeId.DESERT:
          return MoveId.SCORCHING_SANDS;
        case BiomeId.WASTELAND:
          return MoveId.DRAGON_PULSE;
        case BiomeId.CONSTRUCTION_SITE:
          return MoveId.STEEL_BEAM;
        case BiomeId.CAVE:
          return MoveId.POWER_GEM;
        case BiomeId.ICE_CAVE:
          return MoveId.ICE_BEAM;
        case BiomeId.SNOWY_FOREST:
          return MoveId.FROST_BREATH;
        case BiomeId.VOLCANO:
          return MoveId.LAVA_PLUME;
        case BiomeId.GRAVEYARD:
          return MoveId.SHADOW_BALL;
        case BiomeId.RUINS:
          return MoveId.ANCIENT_POWER;
        case BiomeId.TEMPLE:
          return MoveId.EXTRASENSORY;
        case BiomeId.DOJO:
          return MoveId.FOCUS_BLAST;
        case BiomeId.FAIRY_CAVE:
          return MoveId.ALLURING_VOICE;
        case BiomeId.ABYSS:
          return MoveId.OMINOUS_WIND;
        case BiomeId.SPACE:
          return MoveId.DRACO_METEOR;
        case BiomeId.FACTORY:
          return MoveId.FLASH_CANNON;
        case BiomeId.LABORATORY:
          return MoveId.ZAP_CANNON;
        case BiomeId.POWER_PLANT:
          return MoveId.CHARGE_BEAM;
        case BiomeId.END:
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
