import { BattlerTagType } from "#enums/battler-tag-type";
import { Biome } from "#enums/biome";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { type Move } from "#app/data/move";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";
import { MoveEffectAttr } from "#app/data/move-attrs/move-effect-attr";
import { StatStageChangeAttr } from "#app/data/move-attrs/stat-stage-change-attr";
import { StatusEffectAttr } from "#app/data/move-attrs/status-effect-attr";
import { NumberHolder } from "#app/utils";
import { IgnoreMoveEffectsAbAttr } from "../ab-attrs/ignore-move-effect-ab-attr";
import { MoveEffectChanceMultiplierAbAttr } from "../ab-attrs/move-effect-chance-multiplier-ab-attr";
import { applyAbAttrs, applyPreDefendAbAttrs } from "../ability";

/**
 * Attribute used to determine the Biome/Terrain-based secondary effect of Secret Power
 */
export class SecretPowerAttr extends MoveEffectAttr {
  constructor() {
    super(false);
  }

  /**
   * Used to apply the secondary effect to the target Pokemon
   * @returns `true` if a secondary effect is successfully applied
   */
  override apply(user: Pokemon, target: Pokemon, move: Move, args?: any[]): boolean {
    if (!super.apply(user, target, move, args)) {
      return false;
    }
    let secondaryEffect: MoveEffectAttr;
    const terrain = globalScene.arena.getTerrainType();
    if (terrain !== TerrainType.NONE) {
      secondaryEffect = this.determineTerrainEffect(terrain);
    } else {
      const biome = globalScene.arena.biomeType;
      secondaryEffect = this.determineBiomeEffect(biome);
    }
    return secondaryEffect.apply(user, target, move, []);
  }

  /**
   * Determines the secondary effect based on terrain.
   * Takes precedence over biome-based effects.
   * ```
   * Electric Terrain | Paralysis
   * Misty Terrain    | SpAtk -1
   * Grassy Terrain   | Sleep
   * Psychic Terrain  | Speed -1
   * ```
   * @param terrain - {@linkcode TerrainType} The current terrain
   * @returns the chosen secondary effect {@linkcode MoveEffectAttr}
   */
  private determineTerrainEffect(terrain: TerrainType): MoveEffectAttr {
    let secondaryEffect: MoveEffectAttr;
    switch (terrain) {
      case TerrainType.ELECTRIC:
      default:
        secondaryEffect = new StatusEffectAttr(StatusEffect.PARALYSIS, false);
        break;
      case TerrainType.MISTY:
        secondaryEffect = new StatStageChangeAttr([Stat.SPATK], -1, false);
        break;
      case TerrainType.GRASSY:
        secondaryEffect = new StatusEffectAttr(StatusEffect.SLEEP, false);
        break;
      case TerrainType.PSYCHIC:
        secondaryEffect = new StatStageChangeAttr([Stat.SPD], -1, false);
        break;
    }
    return secondaryEffect;
  }

  /**
   * Determines the secondary effect based on biome
   * ```
   * Town, Metropolis, Slum, Dojo, Laboratory, Power Plant + Default | Paralysis
   * Plains, Grass, Tall Grass, Forest, Jungle, Meadow               | Sleep
   * Swamp, Mountain, Temple, Ruins                                  | Speed -1
   * Ice Cave, Snowy Forest                                          | Freeze
   * Volcano                                                         | Burn
   * Fairy Cave                                                      | SpAtk -1
   * Desert, Construction Site, Beach, Island, Badlands              | Accuracy -1
   * Sea, Lake, Seabed                                               | Atk -1
   * Cave, Wasteland, Graveyard, Abyss, Space                        | Flinch
   * End                                                             | Def -1
   * ```
   * @param biome - The current {@linkcode Biome} the battle is set in
   * @returns the chosen secondary effect {@linkcode MoveEffectAttr}
   */
  private determineBiomeEffect(biome: Biome): MoveEffectAttr {
    let secondaryEffect: MoveEffectAttr;
    switch (biome) {
      case Biome.PLAINS:
      case Biome.GRASS:
      case Biome.TALL_GRASS:
      case Biome.FOREST:
      case Biome.JUNGLE:
      case Biome.MEADOW:
        secondaryEffect = new StatusEffectAttr(StatusEffect.SLEEP, false);
        break;
      case Biome.SWAMP:
      case Biome.MOUNTAIN:
      case Biome.TEMPLE:
      case Biome.RUINS:
        secondaryEffect = new StatStageChangeAttr([Stat.SPD], -1, false);
        break;
      case Biome.ICE_CAVE:
      case Biome.SNOWY_FOREST:
        secondaryEffect = new StatusEffectAttr(StatusEffect.FREEZE, false);
        break;
      case Biome.VOLCANO:
        secondaryEffect = new StatusEffectAttr(StatusEffect.BURN, false);
        break;
      case Biome.FAIRY_CAVE:
        secondaryEffect = new StatStageChangeAttr([Stat.SPATK], -1, false);
        break;
      case Biome.DESERT:
      case Biome.CONSTRUCTION_SITE:
      case Biome.BEACH:
      case Biome.ISLAND:
      case Biome.BADLANDS:
        secondaryEffect = new StatStageChangeAttr([Stat.ACC], -1, false);
        break;
      case Biome.SEA:
      case Biome.LAKE:
      case Biome.SEABED:
        secondaryEffect = new StatStageChangeAttr([Stat.ATK], -1, false);
        break;
      case Biome.CAVE:
      case Biome.WASTELAND:
      case Biome.GRAVEYARD:
      case Biome.ABYSS:
      case Biome.SPACE:
        secondaryEffect = new AddBattlerTagAttr(BattlerTagType.FLINCHED, false);
        break;
      case Biome.END:
        secondaryEffect = new StatStageChangeAttr([Stat.DEF], -1, false);
        break;
      case Biome.TOWN:
      case Biome.METROPOLIS:
      case Biome.SLUM:
      case Biome.DOJO:
      case Biome.FACTORY:
      case Biome.LABORATORY:
      case Biome.POWER_PLANT:
      default:
        secondaryEffect = new StatusEffectAttr(StatusEffect.PARALYSIS, false);
        break;
    }
    return secondaryEffect;
  }

  /** Secret Power ignores the move chance bonus from the Water + Fire Pledge combo effect */
  override getMoveChance(
    user: Pokemon,
    target: Pokemon,
    move: Move,
    selfEffect?: Boolean,
    showAbility?: Boolean,
  ): number {
    const moveChance = new NumberHolder(this.effectChanceOverride ?? move.chance);

    applyAbAttrs(
      MoveEffectChanceMultiplierAbAttr,
      user,
      null,
      false,
      moveChance,
      move,
      target,
      selfEffect,
      showAbility,
    );

    if (!selfEffect) {
      applyPreDefendAbAttrs(IgnoreMoveEffectsAbAttr, target, user, null, null, false, moveChance);
    }
    return moveChance.value;
  }
}
