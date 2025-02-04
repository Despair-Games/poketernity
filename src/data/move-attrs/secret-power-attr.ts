import { BattlerTagType } from "#enums/battler-tag-type";
import { Biome } from "#enums/biome";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { TerrainType } from "#enums/terrain-type";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { type Move } from "#app/data/move";
import { AddBattlerTagAttr } from "./add-battler-tag-attr";
import { StatStageChangeAttr } from "#app/data/move-attrs/stat-stage-change-attr";
import { StatusEffectAttr } from "#app/data/move-attrs/status-effect-attr";
import { NumberHolder } from "#app/utils";
import { IgnoreMoveEffectsAbAttr } from "#app/data/ab-attrs/ignore-move-effect-ab-attr";
import { MoveEffectChanceMultiplierAbAttr } from "#app/data/ab-attrs/move-effect-chance-multiplier-ab-attr";
import { applyAbAttrs } from "#app/data/apply-ab-attrs";
import { ChanceBasedMoveEffectAttr } from "./chance-based-move-effect-attr";

/**
 * Attribute used to determine the Biome/Terrain-based secondary
 * effect of {@link https://bulbapedia.bulbagarden.net/wiki/Secret_Power_(move) | Secret Power}.
 * @extends ChanceBasedMoveEffectAttr
 */
export class SecretPowerAttr extends ChanceBasedMoveEffectAttr {
  constructor() {
    super(false, { lastHitOnly: true });
  }

  override applyEffect(user: Pokemon, target: Pokemon, move: Move): boolean {
    const terrain = globalScene.arena.getTerrainType();
    const biome = globalScene.arena.biomeType;
    const secondaryEffect = this.determineTerrainEffect(terrain) ?? this.determineBiomeEffect(biome);
    return secondaryEffect.applyEffect(user, target, move);
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
  private determineTerrainEffect(terrain: TerrainType): ChanceBasedMoveEffectAttr | undefined {
    switch (terrain) {
      case TerrainType.ELECTRIC:
        return new StatusEffectAttr(StatusEffect.PARALYSIS, false, undefined, undefined);
      case TerrainType.MISTY:
        return new StatStageChangeAttr([Stat.SPATK], -1, false);
      case TerrainType.GRASSY:
        return new StatusEffectAttr(StatusEffect.SLEEP, false, undefined, undefined);
      case TerrainType.PSYCHIC:
        return new StatStageChangeAttr([Stat.SPD], -1, false);
      default:
        return undefined;
    }
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
  private determineBiomeEffect(biome: Biome): ChanceBasedMoveEffectAttr {
    switch (biome) {
      case Biome.PLAINS:
      case Biome.GRASS:
      case Biome.TALL_GRASS:
      case Biome.FOREST:
      case Biome.JUNGLE:
      case Biome.MEADOW:
        return new StatusEffectAttr(StatusEffect.SLEEP, false, undefined, undefined, -1);
      case Biome.SWAMP:
      case Biome.MOUNTAIN:
      case Biome.TEMPLE:
      case Biome.RUINS:
        return new StatStageChangeAttr([Stat.SPD], -1, false, { effectChanceOverride: -1 });
      case Biome.ICE_CAVE:
      case Biome.SNOWY_FOREST:
        return new StatusEffectAttr(StatusEffect.FREEZE, false, undefined, undefined, -1);
      case Biome.VOLCANO:
        return new StatusEffectAttr(StatusEffect.BURN, false, undefined, undefined, -1);
      case Biome.FAIRY_CAVE:
        return new StatStageChangeAttr([Stat.SPATK], -1, false, { effectChanceOverride: -1 });
      case Biome.DESERT:
      case Biome.CONSTRUCTION_SITE:
      case Biome.BEACH:
      case Biome.ISLAND:
      case Biome.BADLANDS:
        return new StatStageChangeAttr([Stat.ACC], -1, false, { effectChanceOverride: -1 });
      case Biome.SEA:
      case Biome.LAKE:
      case Biome.SEABED:
        return new StatStageChangeAttr([Stat.ATK], -1, false, { effectChanceOverride: -1 });
      case Biome.CAVE:
      case Biome.WASTELAND:
      case Biome.GRAVEYARD:
      case Biome.ABYSS:
      case Biome.SPACE:
        return new AddBattlerTagAttr(BattlerTagType.FLINCHED, false, { effectChanceOverride: -1 });
      case Biome.END:
        return new StatStageChangeAttr([Stat.DEF], -1, false, { effectChanceOverride: -1 });
      case Biome.TOWN:
      case Biome.METROPOLIS:
      case Biome.SLUM:
      case Biome.DOJO:
      case Biome.FACTORY:
      case Biome.LABORATORY:
      case Biome.POWER_PLANT:
      default:
        return new StatusEffectAttr(StatusEffect.PARALYSIS, false, undefined, undefined, -1);
    }
  }

  /** Secret Power ignores the move chance bonus from the Water + Fire Pledge combo effect */
  override getMoveChance(
    user: Pokemon,
    target: Pokemon,
    move: Move,
    selfEffect: boolean,
    showAbility: boolean = false,
  ): number {
    const moveChance = new NumberHolder(this.effectChanceOverride ?? move.chance);

    applyAbAttrs(MoveEffectChanceMultiplierAbAttr, user, false, moveChance, move, showAbility);

    if (!selfEffect) {
      applyAbAttrs(IgnoreMoveEffectsAbAttr, target, false, user, move, moveChance);
    }
    return moveChance.value;
  }
}
