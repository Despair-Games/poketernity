/* biome-ignore-start lint/correctness/noUnusedImports: tsdoc imports */
import type { NewArenaEvent } from "#events/battle-scene";
import type { Arena } from "#field/arena";
import type { GameManager } from "#test/test-utils/game-manager";
/* biome-ignore-end lint/correctness/noUnusedImports: tsdoc imports */

import type { BattleStyle } from "#app/overrides";
import { activeOverrides, defaultOverrides } from "#app/overrides";
import { timedEventManager } from "#app/timed-event-manager";
import type { Variant } from "#data/variant";
import { AbilityId } from "#enums/ability-id";
import { BiomeId } from "#enums/biome-id";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import type { MysteryEncounterTier } from "#enums/mystery-encounter-tier";
import type { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { Nature } from "#enums/nature";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { TerrainType } from "#enums/terrain-type";
import { TrainerType } from "#enums/trainer-type";
import type { Unlockables } from "#enums/unlockables";
import { WeatherType } from "#enums/weather-type";
import type { ModifierOverride } from "#modifier/modifier-type";
import { GameManagerHelper } from "#test/test-utils/helpers/game-manager-helper";
import type { TimedEvent } from "#types/timed-event";
import { coerceArray, enumValueToKey } from "#utils/common-utils";
import { shiftCharCodes } from "#utils/string-utils";
import { expect, vi } from "vitest";

/**
 * Helper to handle overrides in tests
 */
export class OverridesHelper extends GameManagerHelper {
  /**
   * If `true`, removes the starting items from enemies at the start of each test.
   * @defaultValue `true`
   */
  public removeEnemyStartingItems: boolean = true;
  /**
   * If `true`, sets the shiny overrides to disable shinies at the start of each test.
   * @defaultValue `true`
   */
  public disableShinies: boolean = true;
  /**
   * If `true`, will set the IV overrides for player and enemy pokemon to `31` at the start of each test.
   * @defaultValue `true`
   */
  public normalizeIVs: boolean = true;
  /**
   * If `true`, will set the Nature overrides for player and enemy pokemon to a neutral nature at the start of each test.
   * @defaultValue `true`
   */
  public normalizeNatures: boolean = true;
  /**
   * If `true`, will automatically set the level cap to `1` at the start of each test
   * (effectively disabling experience gain and thus level ups as well).
   * @defaultValue `true`
   */
  public disableExpGain: boolean = true;

  /**
   * Override the starting biome
   * @warning Any event listeners that are attached to {@linkcode NewArenaEvent} may need to be handled down the line
   * @param biome the biome to set
   */
  public startingBiome(biome: BiomeId): this {
    this.game.scene.newArena(biome);
    this.log(`Starting biome set to ${enumValueToKey(BiomeId, biome)} (=${biome})!`);
    return this;
  }

  /**
   * Override the starting wave (index)
   * @param wave the wave (index) to set. Classic: `1`-`200`
   * @returns `this`
   */
  public startingWave(wave: number): this {
    vi.spyOn(activeOverrides, "STARTING_WAVE_OVERRIDE", "get").mockReturnValue(wave);
    this.log(`Starting wave set to ${wave}!`);
    return this;
  }

  /**
   * Override the player (pokemon) starting level
   * @param level the (pokemon) level to set
   * @returns `this`
   */
  public startingLevel(level: SpeciesId | number): this {
    vi.spyOn(activeOverrides, "STARTING_LEVEL_OVERRIDE", "get").mockReturnValue(level);
    this.log(`Player Pokemon starting level set to ${level}!`);
    return this;
  }

  /**
   * Override the XP Multiplier
   * @param value the XP multiplier to set
   * @returns `this`
   */
  public xpMultiplier(value: number): this {
    vi.spyOn(activeOverrides, "XP_MULTIPLIER_OVERRIDE", "get").mockReturnValue(value);
    this.log(`XP Multiplier set to ${value}!`);
    return this;
  }

  /**
   * Override the player pokemon level cap
   * @param value - The level to set the cap to. Negative numbers disable the cap entirely, and `0` resets to default behavior.
   * @returns `this`
   */
  public levelCap(value: number): this {
    vi.spyOn(activeOverrides, "LEVEL_CAP_OVERRIDE", "get").mockReturnValue(value);
    if (value === 0) {
      this.log("Default level cap re-enabled!");
    } else {
      this.log(`Level Cap set to ${value < 0 ? Number.MAX_SAFE_INTEGER : value}!`);
    }
    return this;
  }

  /**
   * Override the player (pokemon) starting held items
   * @param items the items to hold
   * @returns `this`
   */
  public startingHeldItems(items: ModifierOverride[]): this {
    vi.spyOn(activeOverrides, "STARTING_HELD_ITEMS_OVERRIDE", "get").mockReturnValue(items);
    this.log("Player Pokemon starting held items set to:", items);
    return this;
  }

  /**
   * Override the player pokemon {@linkcode SpeciesId | species}.
   *
   * **Warning**: **DO NOT** use for Classic or Challenge mode tests,
   * instead pass the species you want to use to `runToSummon` or `startBattle`.
   * @param species the {@linkcode SpeciesId | species} to set
   * @returns `this`
   */
  public starterSpecies(species: SpeciesId | number): this {
    vi.spyOn(activeOverrides, "STARTER_SPECIES_OVERRIDE", "get").mockReturnValue(species);
    this.log(`Player Pokemon species set to ${SpeciesId[species]} (=${species})!`);
    return this;
  }

  /**
   * Override the player (pokemons) forms
   * @param forms the (pokemon) forms to set
   * @returns `this`
   */
  public starterForms(forms: Partial<Record<SpeciesId, number>>): this {
    vi.spyOn(activeOverrides, "STARTER_FORM_OVERRIDES", "get").mockReturnValue(forms);
    const formsStr = Object.entries(forms)
      .map(([speciesId, formIndex]) => `${SpeciesId[speciesId]}=${formIndex}`)
      .join(", ");
    this.log(`Player Pokemon form set to: ${formsStr}!`);
    return this;
  }

  /**
   * Override the enemy (pokemons) forms
   * @param forms the (pokemon) forms to set
   * @returns `this`
   */
  public enemyForms(forms: Partial<Record<SpeciesId, number>>): this {
    vi.spyOn(activeOverrides, "ENEMY_FORM_OVERRIDES", "get").mockReturnValue(forms);
    const formsStr = Object.entries(forms)
      .map(([speciesId, formIndex]) => `${SpeciesId[speciesId]}=${formIndex}`)
      .join(", ");
    this.log(`Enemy Pokemon form set to: ${formsStr}!`);
    return this;
  }

  /**
   * Override the player's starting modifiers
   * @param modifiers the modifiers to set
   * @returns `this`
   */
  public startingModifier(modifiers: ModifierOverride[]): this {
    vi.spyOn(activeOverrides, "STARTING_MODIFIER_OVERRIDE", "get").mockReturnValue(modifiers);
    this.log(`Player starting modifiers set to: ${modifiers}`);
    return this;
  }

  /**
   * Override the player (pokemon) {@linkcode AbilityId | ability}
   *
   * For more fine-grained control over setting specific species to have specific abilities,
   * see {@linkcode GameManager.forceSpeciesSpecificAbility | game.forceSpeciesSpecificAbility}.
   *
   * @param ability the (pokemon) {@linkcode AbilityId | ability} to set
   * @returns `this`
   */
  public ability(ability: AbilityId): this {
    vi.spyOn(activeOverrides, "ABILITY_OVERRIDE", "get").mockReturnValue(ability);
    this.log(`Player Pokemon ability set to ${AbilityId[ability]} (=${ability})!`);
    return this;
  }

  /**
   * Override the player (pokemon) **passive** {@linkcode AbilityId | ability}
   * @param passiveAbility the (pokemon) **passive** {@linkcode AbilityId | ability} to set
   * @returns `this`
   */
  public passiveAbility(passiveAbility: AbilityId): this {
    vi.spyOn(activeOverrides, "PASSIVE_ABILITY_OVERRIDE", "get").mockReturnValue(passiveAbility);
    this.log(`Player Pokemon PASSIVE ability set to ${AbilityId[passiveAbility]} (=${passiveAbility})!`);
    return this;
  }

  /**
   * Override the player (pokemon) {@linkcode MoveId | moves}set
   * @param moveset the {@linkcode MoveId | moves}set to set
   * @returns `this`
   */
  public moveset(moveset: MoveId | MoveId[]): this {
    vi.spyOn(activeOverrides, "MOVESET_OVERRIDE", "get").mockReturnValue(moveset);
    moveset = coerceArray(moveset);
    const movesetStr = moveset.map((moveId) => MoveId[moveId]).join(", ");
    this.log(`Player Pokemon moveset set to ${movesetStr} (=[${moveset.join(", ")}])!`);
    return this;
  }

  /**
   * Override the player (pokemon) {@linkcode StatusEffect | status-effect}
   * @param statusEffect the {@linkcode StatusEffect | status-effect} to set
   * @returns `this`
   */
  public statusEffect(statusEffect: StatusEffect): this {
    vi.spyOn(activeOverrides, "STATUS_OVERRIDE", "get").mockReturnValue(statusEffect);
    this.log(`Player Pokemon status-effect set to ${StatusEffect[statusEffect]} (=${statusEffect})!`);
    return this;
  }

  /**
   * Override the chance of encountering a random enemy trainer
   * @param trainerChance - `0` to disable enemy trainer spawns, `1` to guarantee an enemy trainer spawn
   * @see {@linkcode activeOverrides.RANDOM_TRAINER_CHANCE_OVERRIDE} for a more complete description of this override
   * @returns `this`
   */
  public trainerChance(trainerChance: number): this {
    vi.spyOn(activeOverrides, "RANDOM_TRAINER_CHANCE_OVERRIDE", "get").mockReturnValue(trainerChance);
    if (trainerChance === 0) {
      this.log("Random trainers disabled!");
    } else if (trainerChance === 1) {
      this.log("Random trainer guaranteed for one wave!");
    } else {
      this.log(`Trainer chance set to 1 / ${trainerChance}!`);
    }
    return this;
  }

  /**
   * Override each random enemy trainer to be of a given type
   * @param trainerType - The {@linkcode TrainerType} to set
   * @returns `this`
   */
  public trainerType(trainerType: TrainerType): this {
    vi.spyOn(activeOverrides, "TRAINER_TYPE_OVERRIDE", "get").mockReturnValue(trainerType);
    this.log(`Trainer type set to ${TrainerType[trainerType]} (=${trainerType})!`);
    return this;
  }

  /**
   * Override each wave to not have critical hits
   * @returns `this`
   */
  public disableCrits(): this {
    vi.spyOn(activeOverrides, "NEVER_CRIT_OVERRIDE", "get").mockReturnValue(true);
    this.log("Critical hits are disabled!");
    return this;
  }

  /**
   * Override the {@linkcode WeatherType | weather (type)}
   * @param type {@linkcode WeatherType | weather type} to set
   * @returns `this`
   */
  public weather(type: WeatherType): this {
    vi.spyOn(activeOverrides, "WEATHER_OVERRIDE", "get").mockReturnValue(type);
    this.log(`Weather set to ${WeatherType[type]} (=${type})!`);
    return this;
  }

  /**
   * Override the new weather duration.
   * **Will ALSO affect primal weathers!**
   * **Can NOT be combined with {@linkcode weather}!**
   * @param newWeatherDuration -
   * - `-1` to disable the override
   * - `0` for "infinite" duration
   * - `>= 1` to set the number of turns the weather should last
   * @returns `this`
   * @see {@linkcode Arena.trySetWeather}
   */
  public newWeatherDuration(newWeatherDuration: number): this {
    vi.spyOn(activeOverrides, "NEW_WEATHER_DURATION_OVERRIDE", "get").mockReturnValue(newWeatherDuration);
    if (newWeatherDuration < 0) {
      this.log("Weather duration override disabled!");
    } else {
      this.log(`New weather duration set to ${newWeatherDuration === 0 ? "infinity" : newWeatherDuration}!`);
    }
    return this;
  }

  /**
   * Override the {@linkcode TerrainType | terrain (type)}
   * @param type {@linkcode TerrainType | terarin type} to set
   * @returns `this`
   */
  public terrain(type: TerrainType): this {
    vi.spyOn(activeOverrides, "TERRAIN_OVERRIDE", "get").mockReturnValue(type);
    this.log(`Terrain set to ${enumValueToKey(TerrainType, type)} (=${type})!`);
    return this;
  }

  /**
   * Override the new terrain duration.
   * **Can NOT be combined with {@linkcode terrain}!**
   * @param newTerrainDuration -
   * - `-1` to disable the override
   * - `0` for "infinite" duration
   * - `>= 1` to set the number of turns the terrain should last
   * @returns `this`
   * @see {@linkcode Arena.trySetTerrain}
   */
  public newTerrainDuration(newTerrainDuration: number): this {
    vi.spyOn(activeOverrides, "NEW_TERRAIN_DURATION_OVERRIDE", "get").mockReturnValue(newTerrainDuration);
    if (newTerrainDuration < 0) {
      this.log("Terrain duration override disabled!");
    } else {
      this.log(`New terrain duration set to ${newTerrainDuration === 0 ? "infinity" : newTerrainDuration}!`);
    }
    return this;
  }

  /**
   * Override the seed
   * @param seed the seed to set
   * @returns `this`
   */
  public seed(seed: string): this {
    // Shift the seed here with a negative wave number, to compensate for `resetSeed()` shifting the seed itself.
    this.game.scene.setSeed(shiftCharCodes(seed, (this.game.scene.currentBattle?.waveIndex ?? 0) * -1));
    this.game.scene.resetSeed();
    this.log(`Seed set to "${seed}"!`);
    return this;
  }

  /**
   * Override the battle type (e.g., single or double).
   * @see {@linkcode activeOverrides.BATTLE_TYPE_OVERRIDE}
   * @param battleType battle type to set
   * @returns `this`
   */
  public battleType(battleType: BattleStyle | null): this {
    vi.spyOn(activeOverrides, "BATTLE_TYPE_OVERRIDE", "get").mockReturnValue(battleType);
    this.log(battleType === null ? "Battle type override disabled!" : `Battle type set to ${battleType}!`);
    return this;
  }

  /**
   * Override the enemy (pokemon) {@linkcode SpeciesId | species}
   * @param species the (pokemon) {@linkcode SpeciesId | species} to set
   * @returns `this`
   */
  public enemySpecies(species: SpeciesId | number): this {
    vi.spyOn(activeOverrides, "ENEMY_SPECIES_OVERRIDE", "get").mockReturnValue(species);
    this.log(`Enemy Pokemon species set to ${SpeciesId[species]} (=${species})!`);
    return this;
  }

  /**
   * Override the enemy (pokemon) {@linkcode AbilityId | ability}
   *
   * For more fine-grained control over setting specific species to have specific abilities,
   * see {@linkcode GameManager.forceSpeciesSpecificAbility | game.forceSpeciesSpecificAbility}.
   *
   * @param ability the (pokemon) {@linkcode AbilityId | ability} to set
   * @returns `this`
   */
  public enemyAbility(ability: AbilityId): this {
    vi.spyOn(activeOverrides, "ENEMY_ABILITY_OVERRIDE", "get").mockReturnValue(ability);
    this.log(`Enemy Pokemon ability set to ${AbilityId[ability]} (=${ability})!`);
    return this;
  }

  /**
   * Override the enemy (pokemon) **passive** {@linkcode AbilityId | ability}
   * @param passiveAbility the (pokemon) **passive** {@linkcode AbilityId | ability} to set
   * @returns `this`
   */
  public enemyPassiveAbility(passiveAbility: AbilityId): this {
    vi.spyOn(activeOverrides, "ENEMY_PASSIVE_ABILITY_OVERRIDE", "get").mockReturnValue(passiveAbility);
    this.log(`Enemy Pokemon PASSIVE ability set to ${AbilityId[passiveAbility]} (=${passiveAbility})!`);
    return this;
  }

  /**
   * Override the enemy (pokemon) {@linkcode MoveId | moves}set
   * @param moveset the {@linkcode MoveId | moves}set to set
   * @returns `this`
   */
  public enemyMoveset(moveset: MoveId | MoveId[]): this {
    vi.spyOn(activeOverrides, "ENEMY_MOVESET_OVERRIDE", "get").mockReturnValue(moveset);
    moveset = coerceArray(moveset);
    const movesetStr = moveset.map((moveId) => MoveId[moveId]).join(", ");
    this.log(`Enemy Pokemon moveset set to ${movesetStr} (=[${moveset.join(", ")}])!`);
    return this;
  }

  /**
   * Override the enemy (pokemon) level
   * @param level the level to set
   * @returns `this`
   */
  public enemyLevel(level: number): this {
    vi.spyOn(activeOverrides, "ENEMY_LEVEL_OVERRIDE", "get").mockReturnValue(level);
    this.log(`Enemy Pokemon level set to ${level}!`);
    return this;
  }

  /**
   * Override the enemy (pokemon) {@linkcode StatusEffect | status-effect}
   * @param statusEffect the {@linkcode StatusEffect | status-effect} to set
   * @returns
   */
  public enemyStatusEffect(statusEffect: StatusEffect): this {
    vi.spyOn(activeOverrides, "ENEMY_STATUS_OVERRIDE", "get").mockReturnValue(statusEffect);
    this.log(`Enemy Pokemon status-effect set to ${StatusEffect[statusEffect]} (=${statusEffect})!`);
    return this;
  }

  /**
   * Overrides the IVs of the player pokemon
   * @param ivs - If set to a number, all IVs are set to the same value. Must be between `0` and `31`!
   *
   * If set to an array, that array is applied to the pokemon's IV field as-is.
   * All values must be between `0` and `31`, and the array must be of exactly length `6`!
   *
   * If set to `null`, the override is disabled.
   * @returns `this`
   */
  public playerIVs(ivs: number | number[] | null): this {
    this.normalizeIVs = false;
    vi.spyOn(activeOverrides, "IVS_OVERRIDE", "get").mockReturnValue(ivs);
    if (ivs === null) {
      this.log("Player IVs override disabled!");
    } else {
      this.log(`Player IVs set to ${ivs}!`);
    }
    return this;
  }

  /**
   * Overrides the IVs of the enemy pokemon
   * @param ivs - If set to a number, all IVs are set to the same value. Must be between `0` and `31`!
   *
   * If set to an array, that array is applied to the pokemon's IV field as-is.
   * All values must be between `0` and `31`, and the array must be of exactly length `6`!
   *
   * If set to `null`, the override is disabled.
   * @returns `this`
   */
  public enemyIVs(ivs: number | number[] | null): this {
    this.normalizeIVs = false;
    vi.spyOn(activeOverrides, "ENEMY_IVS_OVERRIDE", "get").mockReturnValue(ivs);
    if (ivs === null) {
      this.log("Enemy IVs override disabled!");
    } else {
      this.log(`Enemy IVs set to ${ivs}!`);
    }
    return this;
  }

  /**
   * Overrides the nature of the player's pokemon
   * @param nature - The nature to set, or `null` to disable the override.
   * @returns `this`
   */
  public nature(nature: Nature | null): this {
    this.normalizeNatures = false;
    vi.spyOn(activeOverrides, "NATURE_OVERRIDE", "get").mockReturnValue(nature);
    if (nature === null) {
      this.log("Player Nature override disabled!");
    } else {
      this.log(`Player Nature set to ${Nature[nature]} (=${nature})!`);
    }
    return this;
  }

  /**
   * Overrides the nature of the enemy's pokemon
   * @param nature - The nature to set, or `null` to disable the override.
   * @returns `this`
   */
  public enemyNature(nature: Nature | null): this {
    this.normalizeNatures = false;
    vi.spyOn(activeOverrides, "ENEMY_NATURE_OVERRIDE", "get").mockReturnValue(nature);
    if (nature === null) {
      this.log("Enemy Nature override disabled!");
    } else {
      this.log(`Enemy Nature set to ${Nature[nature]} (=${nature})!`);
    }
    return this;
  }

  /**
   * Override the enemy (pokemon) held items
   * @param items the items to hold
   * @returns `this`
   */
  public enemyHeldItems(items: ModifierOverride[]): this {
    vi.spyOn(activeOverrides, "ENEMY_HELD_ITEMS_OVERRIDE", "get").mockReturnValue(items);
    this.log("Enemy Pokemon held items set to:", items);
    return this;
  }

  /**
   * Gives the player access to an Unlockable.
   * @param unlockable The Unlockable(s) to enable.
   * @returns `this`
   */
  public enableUnlockable(unlockable: Unlockables[]): this {
    vi.spyOn(activeOverrides, "ITEM_UNLOCK_OVERRIDE", "get").mockReturnValue(unlockable);
    this.log("Temporarily unlocked the following content: ", unlockable);
    return this;
  }

  /**
   * Override the items rolled at the end of a battle
   * @param items the items to be rolled
   * @returns `this`
   */
  public itemRewards(items: ModifierOverride[]): this {
    vi.spyOn(activeOverrides, "ITEM_REWARD_OVERRIDE", "get").mockReturnValue(items);
    this.log("Item rewards set to:", items);
    return this;
  }

  /**
   * Override player shininess
   * @param shininess - `true` or `false` to force the player's pokemon to be shiny or not shiny,
   *   `null` to disable the override and re-enable RNG shinies.
   * @returns `this`
   */
  public shiny(shininess: boolean | null): this {
    vi.spyOn(activeOverrides, "SHINY_OVERRIDE", "get").mockReturnValue(shininess);
    if (shininess === null) {
      this.log("Disabled player Pokemon shiny override!");
    } else {
      this.log(`Set player Pokemon to be ${shininess ? "" : "not "}shiny!`);
    }
    return this;
  }

  /**
   * Override player shiny variant
   * @param variant - The player's shiny variant.
   * @returns `this`
   */
  public shinyVariant(variant: Variant): this {
    vi.spyOn(activeOverrides, "VARIANT_OVERRIDE", "get").mockReturnValue(variant);
    this.log(`Set player Pokemon's shiny variant to ${variant}!`);
    return this;
  }

  /**
   * Override enemy shininess
   * @param shininess - `true` or `false` to force the enemy's pokemon to be shiny or not shiny,
   *   `null` to disable the override and re-enable RNG shinies.
   * @param variant - (Optional) The enemy's shiny {@linkcode Variant}.
   */
  enemyShiny(shininess: boolean | null, variant?: Variant): this {
    vi.spyOn(activeOverrides, "ENEMY_SHINY_OVERRIDE", "get").mockReturnValue(shininess);
    if (shininess === null) {
      this.log("Disabled enemy Pokemon shiny override!");
    } else {
      this.log(`Set enemy Pokemon to be ${shininess ? "" : "not "}shiny!`);
    }

    if (variant !== undefined) {
      vi.spyOn(activeOverrides, "ENEMY_VARIANT_OVERRIDE", "get").mockReturnValue(variant);
      this.log(`Set enemy shiny variant to be ${variant}!`);
    }
    return this;
  }

  /**
   * Override the enemy (Pokemon) to have the given amount of health segments
   * @param healthSegments the number of segments to give
   * - `0` (default): the health segments will be handled like in the game based on wave, level and species
   * - `1`: the Pokemon will not be a boss
   * - `2`+: the Pokemon will be a boss with the given number of health segments
   * @returns `this`
   */
  public enemyHealthSegments(healthSegments: number): this {
    vi.spyOn(activeOverrides, "ENEMY_HEALTH_SEGMENTS_OVERRIDE", "get").mockReturnValue(healthSegments);
    this.log("Enemy Pokemon health segments set to:", healthSegments);
    return this;
  }

  /**
   * Override the statuses Paralysis, Freeze, Sleep, Confusion, or Infatuation  to always or never activate
   * @param activate - `true` to force activation, `false` to force no activation, `null` to disable the override
   * @returns `this`
   */
  public statusActivation(activate: boolean | null): this {
    vi.spyOn(activeOverrides, "STATUS_ACTIVATION_OVERRIDE", "get").mockReturnValue(activate);
    if (activate !== null) {
      this.log(`Paralysis and Freeze forced to ${activate ? "always" : "never"} activate!`);
    } else {
      this.log("Status activation override disabled!");
    }
    return this;
  }

  /**
   * @param forceTera (Default `true`) If `true`, forces every enemy Pokemon to Terastallize. If `false`, disables this override.
   * @returns `this`
   */
  public forceEnemyTera(forceTera: boolean = true): this {
    vi.spyOn(activeOverrides, "FORCE_ENEMY_TERA_OVERRIDE", "get").mockReturnValue(forceTera);
    this.log(`Enemy Pokemon are ${forceTera ? "" : "no longer "}forced to Terastallize!`);
    return this;
  }

  /**
   * @param type If equal to `ElementalType.UNKNOWN`, disable this override. Otherwise, force every player Pokemon's Tera type to be this type.
   * @returns `this`
   */
  public teraType(type: ElementalType): this {
    vi.spyOn(activeOverrides, "TERA_TYPE_OVERRIDE", "get").mockReturnValue(type);
    if (type === ElementalType.UNKNOWN) {
      this.log("Disabled override for player Tera type!");
    } else {
      this.log(`Player Tera type set to ${enumValueToKey(ElementalType, type)} (=${type})!`);
    }
    return this;
  }

  /**
   * @param type If equal to `ElementalType.UNKNOWN`, disable this override. Otherwise, force every enemy Pokemon's Tera type to be this type.
   * @returns `this`
   */
  public enemyTeraType(type: ElementalType): this {
    vi.spyOn(activeOverrides, "ENEMY_TERA_TYPE_OVERRIDE", "get").mockReturnValue(type);
    if (type === ElementalType.UNKNOWN) {
      this.log("Disabled override for enemy Tera type!");
    } else {
      this.log(`Enemy Tera type set to ${enumValueToKey(ElementalType, type)} (=${type})!`);
    }
    return this;
  }

  /**
   * Override the encounter chance for a mystery encounter.
   * @param percentage the encounter chance in %
   * @returns `this`
   */
  public mysteryEncounterChance(percentage: number): this {
    const maxRate: number = 256; // 100%
    const rate = maxRate * (percentage / 100);
    vi.spyOn(activeOverrides, "MYSTERY_ENCOUNTER_RATE_OVERRIDE", "get").mockReturnValue(rate);
    this.log(`Mystery encounter chance set to ${percentage}% (=${rate})!`);
    return this;
  }

  /**
   * Override the encounter chance for a mystery encounter.
   * @param tier - The {@linkcode MysteryEncounterTier} to encounter
   * @returns `this`
   */
  public mysteryEncounterTier(tier: MysteryEncounterTier): this {
    vi.spyOn(activeOverrides, "MYSTERY_ENCOUNTER_TIER_OVERRIDE", "get").mockReturnValue(tier);
    this.log(`Mystery encounter tier set to ${tier}!`);
    return this;
  }

  /**
   * Override the encounter that spawns for the scene
   * @param encounterType - The {@linkcode MysteryEncounterType} of the encounter
   * @returns `this`
   */
  public mysteryEncounter(encounterType: MysteryEncounterType): this {
    vi.spyOn(activeOverrides, "MYSTERY_ENCOUNTER_OVERRIDE", "get").mockReturnValue(encounterType);
    this.log(`Mystery encounter override set to ${encounterType}!`);
    return this;
  }

  /**
   * Override the ongoing timed events.
   * @param events array of {@linkcode TimedEvents}
   * @param systemDate optional date to set the system time to
   * @returns `this`
   */
  public timedEvents(events: TimedEvent[], systemDate?: Date): this {
    if (systemDate) {
      vi.setSystemTime(systemDate);
      this.log("System time set to:", systemDate);
    }
    (timedEventManager as any).setEvents(events);
    this.log("Timed events overriden to:", events);
    return this;
  }

  private log(...params: any[]) {
    console.log("Overrides:", ...params);
  }

  public sanitizeOverrides(): void {
    for (const key of Object.keys(defaultOverrides)) {
      if (activeOverrides[key] !== defaultOverrides[key]) {
        vi.spyOn(activeOverrides, key as any, "get").mockReturnValue(defaultOverrides[key]);
      }
    }
    expect(activeOverrides).toEqual(defaultOverrides);
    this.log("Sanitizing all overrides!");
  }
}
