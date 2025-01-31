import { Biome } from "#enums/biome";
import { MoveId } from "#enums/move-id";
import { TerrainType } from "#enums/terrain-type";
import { type Pokemon, PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { LoadMoveAnimPhase } from "#app/phases/load-move-anim-phase";
import { MovePhase } from "#app/phases/move-phase";
import type { Move } from "#app/data/move";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";

/**
 * Attribute to invoke another move based on the current biome
 * (or terrain, if one is on the field).
 * Used by {@link https://bulbapedia.bulbagarden.net/wiki/Nature_Power_(move) | Nature Power}.
 * @extends OverrideMoveEffectAttr
 */
export class NaturePowerAttr extends OverrideMoveEffectAttr {
  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    let moveId: MoveId;
    switch (globalScene.arena.getTerrainType()) {
      // this allows terrains to 'override' the biome move
      case TerrainType.NONE:
        switch (globalScene.arena.biomeType) {
          case Biome.TOWN:
            moveId = MoveId.ROUND;
            break;
          case Biome.METROPOLIS:
            moveId = MoveId.TRI_ATTACK;
            break;
          case Biome.SLUM:
            moveId = MoveId.SLUDGE_BOMB;
            break;
          case Biome.PLAINS:
            moveId = MoveId.SILVER_WIND;
            break;
          case Biome.GRASS:
            moveId = MoveId.GRASS_KNOT;
            break;
          case Biome.TALL_GRASS:
            moveId = MoveId.POLLEN_PUFF;
            break;
          case Biome.MEADOW:
            moveId = MoveId.GIGA_DRAIN;
            break;
          case Biome.FOREST:
            moveId = MoveId.BUG_BUZZ;
            break;
          case Biome.JUNGLE:
            moveId = MoveId.LEAF_STORM;
            break;
          case Biome.SEA:
            moveId = MoveId.HYDRO_PUMP;
            break;
          case Biome.SWAMP:
            moveId = MoveId.MUD_BOMB;
            break;
          case Biome.BEACH:
            moveId = MoveId.SCALD;
            break;
          case Biome.LAKE:
            moveId = MoveId.BUBBLE_BEAM;
            break;
          case Biome.SEABED:
            moveId = MoveId.BRINE;
            break;
          case Biome.ISLAND:
            moveId = MoveId.LEAF_TORNADO;
            break;
          case Biome.MOUNTAIN:
            moveId = MoveId.AIR_SLASH;
            break;
          case Biome.BADLANDS:
            moveId = MoveId.EARTH_POWER;
            break;
          case Biome.DESERT:
            moveId = MoveId.SCORCHING_SANDS;
            break;
          case Biome.WASTELAND:
            moveId = MoveId.DRAGON_PULSE;
            break;
          case Biome.CONSTRUCTION_SITE:
            moveId = MoveId.STEEL_BEAM;
            break;
          case Biome.CAVE:
            moveId = MoveId.POWER_GEM;
            break;
          case Biome.ICE_CAVE:
            moveId = MoveId.ICE_BEAM;
            break;
          case Biome.SNOWY_FOREST:
            moveId = MoveId.FROST_BREATH;
            break;
          case Biome.VOLCANO:
            moveId = MoveId.LAVA_PLUME;
            break;
          case Biome.GRAVEYARD:
            moveId = MoveId.SHADOW_BALL;
            break;
          case Biome.RUINS:
            moveId = MoveId.ANCIENT_POWER;
            break;
          case Biome.TEMPLE:
            moveId = MoveId.EXTRASENSORY;
            break;
          case Biome.DOJO:
            moveId = MoveId.FOCUS_BLAST;
            break;
          case Biome.FAIRY_CAVE:
            moveId = MoveId.ALLURING_VOICE;
            break;
          case Biome.ABYSS:
            moveId = MoveId.OMINOUS_WIND;
            break;
          case Biome.SPACE:
            moveId = MoveId.DRACO_METEOR;
            break;
          case Biome.FACTORY:
            moveId = MoveId.FLASH_CANNON;
            break;
          case Biome.LABORATORY:
            moveId = MoveId.ZAP_CANNON;
            break;
          case Biome.POWER_PLANT:
            moveId = MoveId.CHARGE_BEAM;
            break;
          case Biome.END:
            moveId = MoveId.ETERNABEAM;
            break;
        }
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
        // Just in case there's no match
        moveId = MoveId.TRI_ATTACK;
        break;
    }

    user.getMoveQueue().push({ moveId: moveId, targets: [target.getBattlerIndex()], ignorePP: true });
    globalScene.unshiftPhase(new LoadMoveAnimPhase(moveId));
    globalScene.unshiftPhase(
      new MovePhase(user, [target.getBattlerIndex()], new PokemonMove(moveId, 0, 0, true), true),
    );
    return true;
  }
}
