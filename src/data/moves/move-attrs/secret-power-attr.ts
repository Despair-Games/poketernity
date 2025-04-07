import type { IgnoreMoveEffectsAbAttr } from "#app/data/abilities/ab-attrs/ignore-move-effects-ab-attr";
import type { MoveEffectChanceMultiplierAbAttr } from "#app/data/abilities/ab-attrs/move-effect-chance-multiplier-ab-attr";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import { type Move } from "#app/data/moves/move";
import { AddBattlerTagAttr } from "#app/data/moves/move-attrs/add-battler-tag-attr";
import { ChanceBasedMoveEffectAttr } from "#app/data/moves/move-attrs/chance-based-move-effect-attr";
import { StatStageChangeAttr } from "#app/data/moves/move-attrs/stat-stage-change-attr";
import { StatusEffectAttr } from "#app/data/moves/move-attrs/status-effect-attr";
import type { Pokemon } from "#app/field/pokemon";
import { globalScene } from "#app/global-scene";
import { NumberHolder } from "#app/utils";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BiomeId } from "#enums/biome-id";
import { Stat } from "#enums/stat";
import { StatusEffect } from "#enums/status-effect";
import { TerrainType } from "#enums/terrain-type";

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
    const biome = globalScene.arena.biomeId;
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
   * @param biome - The current {@linkcode BiomeId} the battle is set in
   * @returns the chosen secondary effect {@linkcode MoveEffectAttr}
   */
  private determineBiomeEffect(biome: BiomeId): ChanceBasedMoveEffectAttr {
    switch (biome) {
      case BiomeId.PLAINS:
      case BiomeId.GRASS:
      case BiomeId.TALL_GRASS:
      case BiomeId.FOREST:
      case BiomeId.JUNGLE:
      case BiomeId.MEADOW:
        return new StatusEffectAttr(StatusEffect.SLEEP, false, undefined, undefined, -1);
      case BiomeId.SWAMP:
      case BiomeId.MOUNTAIN:
      case BiomeId.TEMPLE:
      case BiomeId.RUINS:
        return new StatStageChangeAttr([Stat.SPD], -1, false, { effectChanceOverride: -1 });
      case BiomeId.ICE_CAVE:
      case BiomeId.SNOWY_FOREST:
        return new StatusEffectAttr(StatusEffect.FREEZE, false, undefined, undefined, -1);
      case BiomeId.VOLCANO:
        return new StatusEffectAttr(StatusEffect.BURN, false, undefined, undefined, -1);
      case BiomeId.FAIRY_CAVE:
        return new StatStageChangeAttr([Stat.SPATK], -1, false, { effectChanceOverride: -1 });
      case BiomeId.DESERT:
      case BiomeId.CONSTRUCTION_SITE:
      case BiomeId.BEACH:
      case BiomeId.ISLAND:
      case BiomeId.BADLANDS:
        return new StatStageChangeAttr([Stat.ACC], -1, false, { effectChanceOverride: -1 });
      case BiomeId.SEA:
      case BiomeId.LAKE:
      case BiomeId.SEABED:
        return new StatStageChangeAttr([Stat.ATK], -1, false, { effectChanceOverride: -1 });
      case BiomeId.CAVE:
      case BiomeId.WASTELAND:
      case BiomeId.GRAVEYARD:
      case BiomeId.ABYSS:
      case BiomeId.SPACE:
        return new AddBattlerTagAttr(BattlerTagType.FLINCHED, false, { effectChanceOverride: -1 });
      case BiomeId.END:
        return new StatStageChangeAttr([Stat.DEF], -1, false, { effectChanceOverride: -1 });
      case BiomeId.TOWN:
      case BiomeId.METROPOLIS:
      case BiomeId.SLUM:
      case BiomeId.DOJO:
      case BiomeId.FACTORY:
      case BiomeId.LABORATORY:
      case BiomeId.POWER_PLANT:
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

    applyAbAttrs<MoveEffectChanceMultiplierAbAttr>(
      AbAttrFlag.MOVE_EFFECT_CHANCE_MULTIPLIER,
      user,
      false,
      moveChance,
      move,
      showAbility,
    );

    if (!selfEffect) {
      applyAbAttrs<IgnoreMoveEffectsAbAttr>(AbAttrFlag.IGNORE_MOVE_EFFECTS, target, false, user, move, moveChance);
    }
    return moveChance.value;
  }
}
