import { Biome } from "#enums/biome";
import { Moves } from "#enums/moves";
import { TerrainType } from "#enums/terrain-type";
import { type Pokemon, PokemonMove } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { LoadMoveAnimPhase } from "#app/phases/load-move-anim-phase";
import { MovePhase } from "#app/phases/move-phase";
import type { Move } from "#app/data/move";
import { OverrideMoveEffectAttr } from "#app/data/move-attrs/override-move-effect-attr";

export class NaturePowerAttr extends OverrideMoveEffectAttr {
  /**
   * Invokes another move based on the current biome.
   * If terrain is active, the move is based on the active terrain instead.
   */
  override apply(user: Pokemon, target: Pokemon, _move: Move): boolean {
    let moveId;
    switch (globalScene.arena.getTerrainType()) {
      // this allows terrains to 'override' the biome move
      case TerrainType.NONE:
        switch (globalScene.arena.biomeType) {
          case Biome.TOWN:
            moveId = Moves.ROUND;
            break;
          case Biome.METROPOLIS:
            moveId = Moves.TRI_ATTACK;
            break;
          case Biome.SLUM:
            moveId = Moves.SLUDGE_BOMB;
            break;
          case Biome.PLAINS:
            moveId = Moves.SILVER_WIND;
            break;
          case Biome.GRASS:
            moveId = Moves.GRASS_KNOT;
            break;
          case Biome.TALL_GRASS:
            moveId = Moves.POLLEN_PUFF;
            break;
          case Biome.MEADOW:
            moveId = Moves.GIGA_DRAIN;
            break;
          case Biome.FOREST:
            moveId = Moves.BUG_BUZZ;
            break;
          case Biome.JUNGLE:
            moveId = Moves.LEAF_STORM;
            break;
          case Biome.SEA:
            moveId = Moves.HYDRO_PUMP;
            break;
          case Biome.SWAMP:
            moveId = Moves.MUD_BOMB;
            break;
          case Biome.BEACH:
            moveId = Moves.SCALD;
            break;
          case Biome.LAKE:
            moveId = Moves.BUBBLE_BEAM;
            break;
          case Biome.SEABED:
            moveId = Moves.BRINE;
            break;
          case Biome.ISLAND:
            moveId = Moves.LEAF_TORNADO;
            break;
          case Biome.MOUNTAIN:
            moveId = Moves.AIR_SLASH;
            break;
          case Biome.BADLANDS:
            moveId = Moves.EARTH_POWER;
            break;
          case Biome.DESERT:
            moveId = Moves.SCORCHING_SANDS;
            break;
          case Biome.WASTELAND:
            moveId = Moves.DRAGON_PULSE;
            break;
          case Biome.CONSTRUCTION_SITE:
            moveId = Moves.STEEL_BEAM;
            break;
          case Biome.CAVE:
            moveId = Moves.POWER_GEM;
            break;
          case Biome.ICE_CAVE:
            moveId = Moves.ICE_BEAM;
            break;
          case Biome.SNOWY_FOREST:
            moveId = Moves.FROST_BREATH;
            break;
          case Biome.VOLCANO:
            moveId = Moves.LAVA_PLUME;
            break;
          case Biome.GRAVEYARD:
            moveId = Moves.SHADOW_BALL;
            break;
          case Biome.RUINS:
            moveId = Moves.ANCIENT_POWER;
            break;
          case Biome.TEMPLE:
            moveId = Moves.EXTRASENSORY;
            break;
          case Biome.DOJO:
            moveId = Moves.FOCUS_BLAST;
            break;
          case Biome.FAIRY_CAVE:
            moveId = Moves.ALLURING_VOICE;
            break;
          case Biome.ABYSS:
            moveId = Moves.OMINOUS_WIND;
            break;
          case Biome.SPACE:
            moveId = Moves.DRACO_METEOR;
            break;
          case Biome.FACTORY:
            moveId = Moves.FLASH_CANNON;
            break;
          case Biome.LABORATORY:
            moveId = Moves.ZAP_CANNON;
            break;
          case Biome.POWER_PLANT:
            moveId = Moves.CHARGE_BEAM;
            break;
          case Biome.END:
            moveId = Moves.ETERNABEAM;
            break;
        }
        break;
      case TerrainType.MISTY:
        moveId = Moves.MOONBLAST;
        break;
      case TerrainType.ELECTRIC:
        moveId = Moves.THUNDERBOLT;
        break;
      case TerrainType.GRASSY:
        moveId = Moves.ENERGY_BALL;
        break;
      case TerrainType.PSYCHIC:
        moveId = Moves.PSYCHIC;
        break;
      default:
        // Just in case there's no match
        moveId = Moves.TRI_ATTACK;
        break;
    }

    user.getMoveQueue().push({ move: moveId, targets: [target.getBattlerIndex()], ignorePP: true });
    globalScene.unshiftPhase(new LoadMoveAnimPhase(moveId));
    globalScene.unshiftPhase(
      new MovePhase(user, [target.getBattlerIndex()], new PokemonMove(moveId, 0, 0, true), true),
    );
    return true;
  }
}
