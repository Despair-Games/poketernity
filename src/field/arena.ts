import { globalScene } from "#app/global-scene";
import type { BiomeTierTrainerPools, PokemonPools } from "#app/data/balance/biomes";
import { biomePokemonPools, biomeTrainerPools } from "#app/data/balance/biomes";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { type AbstractConstructor, randSeedInt } from "#app/utils";
import type PokemonSpecies from "#app/data/pokemon-species";
import { getPokemonSpecies } from "#app/utils/pokemon-species-utils";
import { getWeatherClearMessage, getWeatherStartMessage, PRIMAL_WEATHER, Weather } from "#app/data/weather";
import { CommonAnim } from "#enums/common-anim";
import type { ElementalType } from "#enums/elemental-type";
import type { Move } from "#app/data/moves/move";
import type { ArenaTag } from "#app/data/arena-tag";
import { EntryHazardTag, getArenaTag } from "#app/data/arena-tag";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { BattlerIndex } from "#enums/battler-index";
import { getTerrainClearMessage, getTerrainStartMessage, Terrain } from "#app/data/terrain";
import { TerrainType } from "#enums/terrain-type";
import { applyAbAttrs } from "#app/data/abilities/apply-ab-attrs";
import type { Pokemon } from "#app/field/pokemon";
import Overrides from "#app/overrides";
import { TagAddedEvent, TagRemovedEvent, TerrainChangedEvent, WeatherChangedEvent } from "#app/events/arena";
import type { ArenaTagType } from "#enums/arena-tag-type";
import { Biome } from "#enums/biome";
import type { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { Abilities } from "#enums/abilities";
import { SpeciesFormChangeRevertWeatherFormTrigger, SpeciesFormChangeWeatherTrigger } from "#app/data/pokemon-forms";
import { CommonAnimPhase } from "#app/phases/common-anim-phase";
import { ShowAbilityPhase } from "#app/phases/show-ability-phase";
import { WeatherType } from "#enums/weather-type";
import { AbAttrFlag } from "#enums/ab-attr-flag";

export class Arena {
  public biomeType: Biome;
  public weather: Weather | null;
  public terrain: Terrain | null;
  public tags: ArenaTag[];
  public bgm: string;
  public ignoreAbilities: boolean;
  public ignoringEffectSource: BattlerIndex | null;

  private lastTimeOfDay: TimeOfDay;

  private pokemonPool: PokemonPools;
  private trainerPool: BiomeTierTrainerPools;

  public readonly eventTarget: EventTarget = new EventTarget();

  constructor(biome: Biome, bgm: string) {
    this.biomeType = biome;
    this.tags = [];
    this.bgm = bgm;
    this.trainerPool = biomeTrainerPools[biome];
    this.updatePoolsForTimeOfDay();
  }

  init() {
    const biomeKey = getBiomeKey(this.biomeType);

    globalScene.arenaPlayer.setBiome(this.biomeType);
    globalScene.arenaPlayerTransition.setBiome(this.biomeType);
    globalScene.arenaEnemy.setBiome(this.biomeType);
    globalScene.arenaNextEnemy.setBiome(this.biomeType);
    globalScene.arenaBg.setTexture(`${biomeKey}_bg`);
    globalScene.arenaBgTransition.setTexture(`${biomeKey}_bg`);

    // Redo this on initialize because during save/load the current wave isn't always
    // set correctly during construction
    this.updatePoolsForTimeOfDay();
  }

  /**
   * Determines if the arena is in one the specified biomes.
   * @param biome - {@linkcode Biome} or array of {@linkcode Biome} to check against
   * @returns `true` if the arena is of the specified biome, `false` otherwise
   */
  public isInBiome(biome: Biome | Biome[]): boolean {
    return Array.isArray(biome) ? biome.includes(this.biomeType) : this.biomeType === biome;
  }

  /**
   * Determines if one of the specified terrains is set in the arena.
   * @param terrain - {@linkcode TerrainType} or array of {@linkcode TerrainType} to check against
   * @returns `true` if the arena is of the specified terrain, `false` otherwise
   */
  public hasTerrain(terrain: TerrainType | TerrainType[]): boolean {
    const terrainType = this.getTerrainType();
    return Array.isArray(terrain) ? terrain.includes(terrainType) : terrainType === terrain;
  }

  /**
   * Determines if one the specified weather effects is set in the arena.
   * Does **not** take into account weather suppression effects.
   * @see {@linkcode Weather.isEffectSuppressed} to check if the weather effect is suppressed.
   * @param weather - {@linkcode WeatherType} or array of {@linkcode WeatherType} to check against
   * @returns `true` if the arena is of the specified weather, `false` otherwise
   */
  public hasWeather(weather: WeatherType | WeatherType[]): boolean {
    const weatherType = this.weather?.weatherType ?? WeatherType.NONE;
    return Array.isArray(weather) ? weather.includes(weatherType) : weatherType === weather;
  }

  /**
   * Determines if the arena is of the specified time of day
   * @param timeOfDay - {@linkcode TimeOfDay} or array of {@linkcode TimeOfDay} to check against
   * @returns `true` if the arena is of the specified time of day, `false` otherwise
   */
  public isTimeOfDay(timeOfDay: TimeOfDay | TimeOfDay[]): boolean {
    return Array.isArray(timeOfDay) ? timeOfDay.includes(this.getTimeOfDay()) : this.getTimeOfDay() === timeOfDay;
  }

  updatePoolsForTimeOfDay(): void {
    const timeOfDay = this.getTimeOfDay();
    if (timeOfDay !== this.lastTimeOfDay) {
      this.pokemonPool = {};
      for (const tier of Object.keys(biomePokemonPools[this.biomeType])) {
        this.pokemonPool[tier] = Object.assign([], biomePokemonPools[this.biomeType][tier][TimeOfDay.ALL]).concat(
          biomePokemonPools[this.biomeType][tier][timeOfDay],
        );
      }
      this.lastTimeOfDay = timeOfDay;
    }
  }

  /**
   * Generates a random Pokemon species for the biome
   * @param waveIndex - The current floor
   * @param level - The level of the generated Pokemon
   * @param attempt - The number of attempts this function has been called since it calls itself recursively
   * - Is 0 if called from a ME
   * - Is `undefined` if called from battle-scene
   * @param luckValue - The player's luck value
   * - If the spawned Pokemon is a boss then the RNG ceiling is decreased by half the luck value
   * - If the spawned Pokemon is not a boss then the RNG ceiling is decreased by twice the luck value
   * @returns a Pokemon species
   */
  randomSpecies(waveIndex: number, level: number, attempt?: number, luckValue?: number): PokemonSpecies {
    const overrideSpecies = globalScene.gameMode.getOverrideSpecies(waveIndex);
    if (overrideSpecies) {
      return overrideSpecies;
    }

    // Boss pool is 0-63, non Boss pool is 0-512
    const isBossSpecies =
      !!globalScene.getEncounterBossSegments(waveIndex, level)
      && !!this.pokemonPool[BiomePoolTier.BOSS].length
      && (this.biomeType !== Biome.END
        || globalScene.gameMode.isClassic
        || globalScene.gameMode.isWaveFinal(waveIndex));
    const randVal = isBossSpecies ? 64 : 512;

    // Luck reduces the rng ceiling
    let luckModifier = 0;
    if (typeof luckValue !== "undefined") {
      luckModifier = luckValue * (isBossSpecies ? 0.5 : 2);
    }
    const tierValue = randSeedInt(randVal - luckModifier);
    let tier = isBossSpecies ? this.generateBossBiomeTier(tierValue) : this.generateNonBossBiomeTier(tierValue);
    console.log(BiomePoolTier[tier]);

    // If the BiomePoolTier is empty, downgrade the rarity
    while (!this.pokemonPool[tier].length) {
      console.log(`Downgraded rarity tier from ${BiomePoolTier[tier]} to ${BiomePoolTier[tier - 1]}`);
      tier--;
    }
    const tierPool = this.pokemonPool[tier];
    let ret: PokemonSpecies;
    let regen = false;
    if (tierPool.length === 0) {
      ret = globalScene.randomSpecies(waveIndex, level);
    } else {
      const entry = tierPool[randSeedInt(tierPool.length)];
      let species: Species;
      if (typeof entry === "number") {
        species = entry as Species;
      } else {
        // Try and evolve the Pokemon if possible
        const levelThresholds = Object.keys(entry);
        for (let l = levelThresholds.length - 1; l >= 0; l--) {
          const levelThreshold = parseInt(levelThresholds[l]);
          if (level >= levelThreshold) {
            const speciesIds = entry[levelThreshold];
            if (speciesIds.length > 1) {
              species = speciesIds[randSeedInt(speciesIds.length)];
            } else {
              species = speciesIds[0];
            }
            break;
          }
        }
      }

      ret = getPokemonSpecies(species!);
      regen = this.determineRerollIfLegendLike(ret, level);
    }

    // Attempt to retry 10 times if generated a LegendLike with an incompatible level
    if (regen && (attempt || 0) < 10) {
      console.log("Incompatible level: regenerating...");
      return this.randomSpecies(waveIndex, level, (attempt || 0) + 1);
    }

    const newSpeciesId = ret.getEnemySpeciesForLevel(level);
    if (newSpeciesId !== ret.speciesId) {
      console.log("Replaced", Species[ret.speciesId], "with", Species[newSpeciesId]);
      ret = getPokemonSpecies(newSpeciesId);
    }
    return ret;
  }

  /**
   * Determines whether or not to reroll for the given {@linkcode PokemonSpecies} and level
   *
   * Mega/Primal/Ultra legendaries and Arceus (720) cannot spawn below level 90
   * Most legendaries (including Regigigas but not Kyurem, Zacian and Zamazenta) cannot spawn below level 70
   * All other sublegends cannot spawn below level 50
   * The final base case only has Cosmoem/Cosmog
   * @returns `true` if rerolling is required, `false` otherwise
   */
  determineRerollIfLegendLike(pokemonSpecies: PokemonSpecies, level: number): boolean {
    if (pokemonSpecies.isLegendLike()) {
      if (pokemonSpecies.baseTotal >= 720) {
        return level < 90;
      } else if (pokemonSpecies.baseTotal >= 670) {
        return level < 70;
      } else if (pokemonSpecies.baseTotal >= 580) {
        return level < 50;
      } else {
        return level < 30;
      }
    }
    return false;
  }

  /**
   * Generates a boss {@linkcode BiomePoolTier} for a given tier value.
   * ```
   * |         | tier values | Chance |
   * |---------|-------------|--------|
   * | Boss    | 20-63       | 44/64  |
   * | Boss R  | 6-19        | 14/64  |
   * | Boss SR | 1-5         | 5/64   |
   * | Boss UR | 0           | 1/64   |
   * ```
   * @param tierValue - Number from 0-63
   * @returns the generated BiomePoolTier
   */
  generateBossBiomeTier(tierValue: number): BiomePoolTier {
    if (tierValue >= 20) {
      return BiomePoolTier.BOSS;
    } else if (tierValue >= 6) {
      return BiomePoolTier.BOSS_RARE;
    } else if (tierValue >= 1) {
      return BiomePoolTier.BOSS_SUPER_RARE;
    } else {
      return BiomePoolTier.BOSS_ULTRA_RARE;
    }
  }

  /**
   * Generates a non-boss {@linkcode BiomePoolTier} for a given tier value.
   * ```
   * |            | tier values | Chance  |
   * |------------|-------------|---------|
   * | Common     | 156-511     | 356/512 |
   * | Uncommon   | 32-155      | 124/512 |
   * | Rare       | 6-31        | 26/512  |
   * | Super Rare | 1-5         | 5/512   |
   * | Ultra Rare | 0           | 1/512   |
   * ```
   * @param tierValue - Number from 0-511
   * @returns the generated BiomePoolTier
   */
  generateNonBossBiomeTier(tierValue: number): BiomePoolTier {
    if (tierValue >= 156) {
      return BiomePoolTier.COMMON;
    } else if (tierValue >= 32) {
      return BiomePoolTier.UNCOMMON;
    } else if (tierValue >= 6) {
      return BiomePoolTier.RARE;
    } else if (tierValue >= 1) {
      return BiomePoolTier.SUPER_RARE;
    } else {
      return BiomePoolTier.ULTRA_RARE;
    }
  }

  /**
   * Attempts to generate a trainer for a given wave.
   * If no trainers can be found then a breeder will be returned instead.
   * @param waveIndex - The wave index
   * @param isBoss - Only true for the brutal mysterious challengers ME
   * @returns a {@linkcode TrainerType | trainer}
   */
  randomTrainerType(waveIndex: number, isBoss: boolean = false): TrainerType {
    const isTrainerBoss =
      !!this.trainerPool[BiomePoolTier.BOSS].length
      && (globalScene.gameMode.isTrainerBoss(waveIndex, this.biomeType, globalScene.offsetGym) || isBoss);
    console.log(isBoss, this.trainerPool);

    // @todo Right now there are no super/ultra or rare boss trainers
    const tierValue = randSeedInt(!isTrainerBoss ? 512 : 64);
    let tier = isTrainerBoss ? this.generateBossBiomeTier(tierValue) : this.generateNonBossBiomeTier(tierValue);
    console.log(BiomePoolTier[tier]);

    while (tier && !this.trainerPool[tier].length) {
      console.log(`Downgraded trainer rarity tier from ${BiomePoolTier[tier]} to ${BiomePoolTier[tier - 1]}`);
      tier--;
    }
    const tierPool = this.trainerPool[tier] || [];
    return !tierPool.length ? TrainerType.BREEDER : tierPool[randSeedInt(tierPool.length)];
  }

  /**
   * Generates a `formIndex` for a given species based on the biome and time of day.
   * Used for Burmy/Wormadam, Rotom, and Lycanroc
   * @param species - The {@linkcode PokemonSpecies} being checked
   * @returns the appropriate formIndex
   */
  getSpeciesFormIndex(species: PokemonSpecies): number {
    switch (species.speciesId) {
      case Species.BURMY:
      case Species.WORMADAM:
        switch (this.biomeType) {
          case Biome.BEACH:
            return 1;
          case Biome.SLUM:
            return 2;
        }
        break;
      case Species.ROTOM:
        switch (this.biomeType) {
          case Biome.VOLCANO:
            return 1;
          case Biome.SEA:
            return 2;
          case Biome.ICE_CAVE:
            return 3;
          case Biome.MOUNTAIN:
            return 4;
          case Biome.TALL_GRASS:
            return 5;
        }
        break;
      case Species.LYCANROC:
        const timeOfDay = this.getTimeOfDay();
        switch (timeOfDay) {
          case TimeOfDay.DAY:
          case TimeOfDay.DAWN:
            return 0;
          case TimeOfDay.DUSK:
            return 2;
          case TimeOfDay.NIGHT:
            return 1;
        }
        break;
    }

    return 0;
  }

  /**
   * Returns a background terrain color ratio for a given biome
   * @returns 0, 131/180 or 1
   */
  getBgTerrainColorRatioForBiome(): number {
    switch (this.biomeType) {
      case Biome.SPACE:
        return 1;
      case Biome.END:
        return 0;
    }

    return 131 / 180;
  }

  /**
   * Sets weather to the override specified in overrides.ts
   * @param weather new {@linkcode WeatherType} to set
   * @returns true to force trySetWeather to return true
   */
  trySetWeatherOverride(weather: WeatherType): boolean {
    this.weather = new Weather(weather, 0);
    globalScene.unshiftPhase(new CommonAnimPhase(undefined, undefined, CommonAnim.SUNNY + (weather - 1)));
    globalScene.queueMessage(getWeatherStartMessage(weather) ?? "");
    return true;
  }

  /**
   * Helper function that checks if it is possible to set a new weather given current weather conditions
   * @param newWeather - The weather that the game is attempting to set
   * @returns `true` if the weather can be set given current conditions | `false` if not
   */
  public canSetWeather(newWeather: WeatherType): boolean {
    if (this.weather) {
      if (newWeather === this.weather.weatherType) {
        return false;
      }
      if (this.weather.isPrimal() && ![WeatherType.NONE, ...PRIMAL_WEATHER].includes(newWeather)) {
        return false;
      }
    } else if (newWeather === WeatherType.NONE) {
      return false;
    }
    return true;
  }

  /**
   * Attempts to set a new weather to the battle
   * @param newWeatherType {@linkcode WeatherType} new {@linkcode WeatherType} to set
   * @param hasPokemonSource boolean if the new weather is from a pokemon
   * @returns true if new weather set, false if no weather provided or attempting to set the same weather as currently in use
   */
  trySetWeather(newWeatherType: WeatherType, hasPokemonSource: boolean): boolean {
    if (Overrides.WEATHER_OVERRIDE) {
      return this.trySetWeatherOverride(Overrides.WEATHER_OVERRIDE);
    }

    if (!this.canSetWeather(newWeatherType)) {
      return false;
    }

    const oldWeatherType = this.weather?.weatherType || WeatherType.NONE;

    const newWeatherDuration = hasPokemonSource && !PRIMAL_WEATHER.includes(newWeatherType) ? 5 : 0;

    if (newWeatherType !== WeatherType.NONE) {
      globalScene.unshiftPhase(new CommonAnimPhase(undefined, undefined, CommonAnim.SUNNY + (newWeatherType - 1)));
      globalScene.queueMessage(getWeatherStartMessage(newWeatherType) ?? "");
      this.weather = new Weather(newWeatherType, newWeatherDuration);
    } else {
      globalScene.queueMessage(getWeatherClearMessage(oldWeatherType) ?? "");
      this.weather = null;
    }

    this.eventTarget.dispatchEvent(new WeatherChangedEvent(oldWeatherType, newWeatherType, newWeatherDuration));

    globalScene
      .getField(true)
      .filter((p) => p.isOnField())
      .map((pokemon) => {
        pokemon.findAndRemoveTags(
          (t) => "weatherTypes" in t && !(t.weatherTypes as WeatherType[]).find((t) => t === newWeatherType),
        );
        applyAbAttrs(AbAttrFlag.POST_WEATHER_CHANGE, pokemon, false, newWeatherType);
      });

    return true;
  }

  /**
   * Function to trigger all weather based form changes
   */
  triggerWeatherBasedFormChanges(): void {
    globalScene.getField(true).forEach((p) => {
      const isCastformWithForecast = p.hasAbility(Abilities.FORECAST) && p.species.speciesId === Species.CASTFORM;
      const isCherrimWithFlowerGift = p.hasAbility(Abilities.FLOWER_GIFT) && p.species.speciesId === Species.CHERRIM;

      if (isCastformWithForecast || isCherrimWithFlowerGift) {
        new ShowAbilityPhase(p.getBattlerIndex());
        globalScene.triggerPokemonFormChange(p, SpeciesFormChangeWeatherTrigger);
      }
    });
  }

  /**
   * Function to trigger all weather based form changes back into their normal forms
   */
  triggerWeatherBasedFormChangesToNormal(): void {
    globalScene.getField(true).forEach((p) => {
      const isCastformWithForecast =
        p.hasAbility(Abilities.FORECAST, false, true) && p.species.speciesId === Species.CASTFORM;
      const isCherrimWithFlowerGift =
        p.hasAbility(Abilities.FLOWER_GIFT, false, true) && p.species.speciesId === Species.CHERRIM;

      if (isCastformWithForecast || isCherrimWithFlowerGift) {
        new ShowAbilityPhase(p.getBattlerIndex());
        return globalScene.triggerPokemonFormChange(p, SpeciesFormChangeRevertWeatherFormTrigger);
      }
    });
  }

  /**
   * Attempts to set terrain
   * @param terrain - {@linkcode TerrainType | The type of terrain}
   * @param hasPokemonSource - Whether the terrain was generated from a Pokemon
   * @param ignoreAnim - Whether or not to ignore animations
   * @returns whether or not the terrain was successfully set
   */
  trySetTerrain(terrain: TerrainType, hasPokemonSource: boolean, ignoreAnim: boolean = false): boolean {
    if (this.terrain?.terrainType === (terrain || undefined)) {
      return false;
    }

    const oldTerrainType = this.terrain?.terrainType || TerrainType.NONE;

    this.terrain = terrain ? new Terrain(terrain, hasPokemonSource ? 5 : 0) : null;

    if (this.terrain) {
      this.eventTarget.dispatchEvent(
        new TerrainChangedEvent(oldTerrainType, this.terrain.terrainType, this.terrain.turnsLeft),
      );
      if (!ignoreAnim) {
        globalScene.unshiftPhase(new CommonAnimPhase(undefined, undefined, CommonAnim.MISTY_TERRAIN + (terrain - 1)));
      }
      globalScene.queueMessage(getTerrainStartMessage(terrain) ?? "");
    } else {
      globalScene.queueMessage(getTerrainClearMessage(oldTerrainType) ?? "");
    }

    globalScene
      .getField(true)
      .filter((p) => p.isOnField())
      .map((pokemon) => {
        pokemon.findAndRemoveTags(
          (t) => "terrainTypes" in t && !(t.terrainTypes as TerrainType[]).find((t) => t === terrain),
        );
        applyAbAttrs(AbAttrFlag.POST_TERRAIN_CHANGE, pokemon, false, terrain);
        applyAbAttrs(AbAttrFlag.TERRAIN_EVENT_TYPE_CHANGE, pokemon, false, false);
      });

    return true;
  }

  /**
   * Checks to see if the current weather will cancel a move
   * @param user - The Pokemon using the move
   * @param move - The move being used
   * @returns whether the move was cancelled by weather
   */
  public isMoveWeatherCancelled(user: Pokemon, move: Move): boolean {
    return !!this.weather && !this.weather.isEffectSuppressed() && this.weather.isMoveWeatherCancelled(user, move);
  }

  /**
   * Checks to see if the current terrain will cancel a move
   * @param user - The Pokemon using the move
   * @param targets - The Pokemon being targetted
   * @param move - The move being used
   * @returns whether the move was cancelled by terrain
   */
  public isMoveTerrainCancelled(user: Pokemon, targets: BattlerIndex[], move: Move): boolean {
    return !!this.terrain && this.terrain.isMoveTerrainCancelled(user, targets, move);
  }

  public getTerrainType(): TerrainType {
    return this.terrain?.terrainType ?? TerrainType.NONE;
  }

  /**
   * Gets the attack type multiplier for weather and terrain
   * @param attackType - The type of the attack being used
   * @param grounded - Whether or not the user is grounded
   * @returns the attack multiplier
   */
  getAttackTypeMultiplier(attackType: ElementalType, grounded: boolean): number {
    let weatherMultiplier = 1;
    if (this.weather && !this.weather.isEffectSuppressed()) {
      weatherMultiplier = this.weather.getAttackTypeMultiplier(attackType);
    }

    let terrainMultiplier = 1;
    if (this.terrain && grounded) {
      terrainMultiplier = this.terrain.getAttackTypeMultiplier(attackType);
    }

    return weatherMultiplier * terrainMultiplier;
  }

  /**
   * Gets the denominator for the chance for a trainer spawn
   * @returns n where 1/n is the chance of a trainer battle
   */
  getTrainerChance(): number {
    switch (this.biomeType) {
      case Biome.METROPOLIS:
        return 2;
      case Biome.SLUM:
      case Biome.BEACH:
      case Biome.DOJO:
      case Biome.CONSTRUCTION_SITE:
        return 4;
      case Biome.PLAINS:
      case Biome.GRASS:
      case Biome.LAKE:
      case Biome.CAVE:
        return 6;
      case Biome.TALL_GRASS:
      case Biome.FOREST:
      case Biome.SEA:
      case Biome.SWAMP:
      case Biome.MOUNTAIN:
      case Biome.BADLANDS:
      case Biome.DESERT:
      case Biome.MEADOW:
      case Biome.POWER_PLANT:
      case Biome.GRAVEYARD:
      case Biome.FACTORY:
      case Biome.SNOWY_FOREST:
        return 8;
      case Biome.ICE_CAVE:
      case Biome.VOLCANO:
      case Biome.RUINS:
      case Biome.WASTELAND:
      case Biome.JUNGLE:
      case Biome.FAIRY_CAVE:
        return 12;
      case Biome.SEABED:
      case Biome.ABYSS:
      case Biome.SPACE:
      case Biome.TEMPLE:
        return 16;
      default:
        return 0;
    }
  }

  /**
   * Gets the time of day
   * ```
   * | time of day | waveCycle | waves |
   * |-------------|-----------|-------|
   * | day         | 0-14      | 15    |
   * | dusk        | 15-19     | 5     |
   * | night       | 20-34     | 15    |
   * | dawn        | 35-39     | 5     |
   * ```
   * It is always night in the abyss
   *
   * @returns the TimeOfDay
   */
  getTimeOfDay(): TimeOfDay {
    if (this.biomeType === Biome.ABYSS) {
      return TimeOfDay.NIGHT;
    }

    const waveCycle = ((globalScene.currentBattle?.waveIndex || 0) + globalScene.waveCycleOffset) % 40;

    if (waveCycle < 15) {
      return TimeOfDay.DAY;
    }

    if (waveCycle < 20) {
      return TimeOfDay.DUSK;
    }

    if (waveCycle < 35) {
      return TimeOfDay.NIGHT;
    }

    return TimeOfDay.DAWN;
  }

  /**
   * Whether or not a biome is indoors affects tinting
   */
  private readonly indoorBiomes = [
    Biome.SEABED,
    Biome.CAVE,
    Biome.ICE_CAVE,
    Biome.POWER_PLANT,
    Biome.DOJO,
    Biome.FACTORY,
    Biome.ABYSS,
    Biome.FAIRY_CAVE,
    Biome.TEMPLE,
    Biome.LABORATORY,
  ];

  isOutside(): boolean {
    return !this.indoorBiomes.includes(this.biomeType);
  }

  // @todo these tints feel like they belong in their own class somewhere
  overrideTint(): [number, number, number] {
    switch (Overrides.ARENA_TINT_OVERRIDE) {
      case TimeOfDay.DUSK:
        return [98, 48, 73].map((c) => Math.round((c + 128) / 2)) as [number, number, number];
      case TimeOfDay.NIGHT:
        return [64, 64, 64];
      case TimeOfDay.DAWN:
      case TimeOfDay.DAY:
      default:
        return [128, 128, 128];
    }
  }

  getDayTint(): [number, number, number] {
    if (Overrides.ARENA_TINT_OVERRIDE !== null) {
      return this.overrideTint();
    }
    switch (this.biomeType) {
      case Biome.ABYSS:
        return [64, 64, 64];
      default:
        return [128, 128, 128];
    }
  }

  getDuskTint(): [number, number, number] {
    if (Overrides.ARENA_TINT_OVERRIDE) {
      return this.overrideTint();
    }
    if (!this.isOutside()) {
      return [0, 0, 0];
    }

    switch (this.biomeType) {
      default:
        return [98, 48, 73].map((c) => Math.round((c + 128) / 2)) as [number, number, number];
    }
  }

  getNightTint(): [number, number, number] {
    if (Overrides.ARENA_TINT_OVERRIDE) {
      return this.overrideTint();
    }
    switch (this.biomeType) {
      case Biome.ABYSS:
      case Biome.SPACE:
      case Biome.END:
        return this.getDayTint();
    }

    if (!this.isOutside()) {
      return [64, 64, 64];
    }

    switch (this.biomeType) {
      default:
        return [48, 48, 98];
    }
  }

  setIgnoreAbilities(ignoreAbilities: boolean, ignoringEffectSource: BattlerIndex | null = null): void {
    this.ignoreAbilities = ignoreAbilities;
    this.ignoringEffectSource = ignoreAbilities ? ignoringEffectSource : null;
  }

  /**
   * Applies each `ArenaTag` in this Arena, based on which side (self, enemy, or both) is passed in as a parameter
   * @param tagType Either an {@linkcode ArenaTagType} string, or an actual {@linkcode ArenaTag} class to filter which ones to apply
   * @param side {@linkcode ArenaTagSide} which side's arena tags to apply
   * @param simulated if `true`, this applies arena tags without changing game state
   * @param args array of parameters that the called upon tags may need
   */
  applyTagsForSide(
    tagType: ArenaTagType | ArenaTagType[],
    side: ArenaTagSide,
    simulated: boolean,
    ...args: unknown[]
  ): void {
    const tagTypeArr = Array.isArray(tagType) ? tagType : [tagType];
    let tags = this.tags.filter((t) => tagTypeArr.includes(t.tagType));
    if (side !== ArenaTagSide.BOTH) {
      tags = tags.filter((t) => t.side === side);
    }
    tags.forEach((t) => t.apply(this, simulated, ...args));
  }

  /**
   * Applies the specified tag to both sides (ie: both user and trainer's tag that match the Tag specified)
   * by calling {@linkcode applyTagsForSide()}
   * @param tagType Either an {@linkcode ArenaTagType} string, or an actual {@linkcode ArenaTag} class to filter which ones to apply
   * @param simulated if `true`, this applies arena tags without changing game state
   * @param args array of parameters that the called upon tags may need
   */
  applyTags(tagType: ArenaTagType | ArenaTagType[], simulated: boolean, ...args: unknown[]): void {
    this.applyTagsForSide(tagType, ArenaTagSide.BOTH, simulated, ...args);
  }

  /**
   * Adds a new tag to the arena
   * @param tagType {@linkcode ArenaTagType} the tag being added
   * @param turnCount How many turns the tag lasts
   * @param sourceMove {@linkcode MoveId} the move the tag came from, or `undefined` if not from a move
   * @param sourceId The ID of the pokemon in play the tag came from (see {@linkcode BattleScene.getPokemonById})
   * @param side {@linkcode ArenaTagSide} which side(s) the tag applies to
   * @param quiet If a message should be queued on screen to announce the tag being added
   * @param targetIndex The {@linkcode BattlerIndex} of the target pokemon
   * @returns `false` if there already exists a tag of this type in the Arena
   */
  addTag(
    tagType: ArenaTagType,
    sourceId: number,
    turnCount: number = 0,
    sourceMove?: MoveId,
    side: ArenaTagSide = ArenaTagSide.BOTH,
    quiet: boolean = false,
  ): boolean {
    const existingTag = this.getTagOnSide(tagType, side);
    if (existingTag) {
      existingTag.onOverlap(this);

      if (existingTag instanceof EntryHazardTag) {
        const { tagType, side, turnCount, layers, maxLayers } = existingTag as EntryHazardTag;
        this.eventTarget.dispatchEvent(new TagAddedEvent(tagType, side, turnCount, layers, maxLayers));
      }

      return false;
    }

    // creates a new tag object
    const newTag = getArenaTag(tagType, sourceId, turnCount, sourceMove, side);
    if (newTag) {
      this.tags.push(newTag);
      newTag.onAdd(this, quiet);

      const { layers = 0, maxLayers = 0 } = newTag instanceof EntryHazardTag ? newTag : {};

      this.eventTarget.dispatchEvent(
        new TagAddedEvent(newTag.tagType, newTag.side, newTag.turnCount, layers, maxLayers),
      );
    }

    return true;
  }

  /**
   * Attempts to get a tag from the Arena via {@linkcode getTagOnSide} that applies to both sides
   * @param tagType The {@linkcode ArenaTagType} or {@linkcode ArenaTag} to get
   * @returns either the {@linkcode ArenaTag}, or `undefined` if it isn't there
   */
  getTag(tagType: ArenaTagType | AbstractConstructor<ArenaTag>): ArenaTag | undefined {
    return this.getTagOnSide(tagType, ArenaTagSide.BOTH);
  }

  hasTag(tagType: ArenaTagType): boolean {
    return !!this.getTag(tagType);
  }

  /**
   * Attempts to get a tag from the Arena from a specific side (the tag passed in has to either apply to both sides, or the specific side only)
   *
   * eg: `MIST` only applies to the user's side, while `MUD_SPORT` applies to both user and enemy side
   * @param tagType The {@linkcode ArenaTagType} or {@linkcode ArenaTag} to get
   * @param side The {@linkcode ArenaTagSide} to look at
   * @returns either the {@linkcode ArenaTag}, or `undefined` if it isn't there
   */
  getTagOnSide(tagType: ArenaTagType | AbstractConstructor<ArenaTag>, side: ArenaTagSide): ArenaTag | undefined {
    return typeof tagType === "number"
      ? this.tags.find(
          (t) =>
            t.tagType === tagType && (side === ArenaTagSide.BOTH || t.side === ArenaTagSide.BOTH || t.side === side),
        )
      : this.tags.find(
          (t) =>
            t instanceof tagType && (side === ArenaTagSide.BOTH || t.side === ArenaTagSide.BOTH || t.side === side),
        );
  }

  /**
   * Uses {@linkcode findTagsOnSide} to filter (using the parameter function) for specific tags that apply to both sides
   * @param tagPredicate a function mapping {@linkcode ArenaTag}s to `boolean`s
   * @returns array of {@linkcode ArenaTag}s from which the Arena's tags return true and apply to both sides
   */
  findTags(tagPredicate: (t: ArenaTag) => boolean): ArenaTag[] {
    return this.findTagsOnSide(tagPredicate, ArenaTagSide.BOTH);
  }

  /**
   * Returns specific tags from the arena that pass the `tagPredicate` function passed in as a parameter, and apply to the given side
   * @param tagPredicate a function mapping {@linkcode ArenaTag}s to `boolean`s
   * @param side The {@linkcode ArenaTagSide} to look at
   * @returns array of {@linkcode ArenaTag}s from which the Arena's tags return `true` and apply to the given side
   */
  findTagsOnSide(tagPredicate: (t: ArenaTag) => boolean, side: ArenaTagSide): ArenaTag[] {
    return this.tags.filter(
      (t) => tagPredicate(t) && (side === ArenaTagSide.BOTH || t.side === ArenaTagSide.BOTH || t.side === side),
    );
  }

  lapseTags(): void {
    this.tags
      .filter((t) => !t.lapse(this))
      .forEach((t) => {
        t.onRemove(this);
        this.tags.splice(this.tags.indexOf(t), 1);

        this.eventTarget.dispatchEvent(new TagRemovedEvent(t.tagType, t.side, t.turnCount));
      });
  }

  removeTag(tagType: ArenaTagType): boolean {
    const tags = this.tags;
    const tag = tags.find((t) => t.tagType === tagType);
    if (tag) {
      tag.onRemove(this);
      tags.splice(tags.indexOf(tag), 1);

      this.eventTarget.dispatchEvent(new TagRemovedEvent(tag.tagType, tag.side, tag.turnCount));
    }
    return !!tag;
  }

  removeTagOnSide(tagType: ArenaTagType, side: ArenaTagSide, quiet: boolean = false): boolean {
    const tag = this.getTagOnSide(tagType, side);
    if (tag) {
      tag.onRemove(this, quiet);
      this.tags.splice(this.tags.indexOf(tag), 1);

      this.eventTarget.dispatchEvent(new TagRemovedEvent(tag.tagType, tag.side, tag.turnCount));
    }
    return !!tag;
  }

  removeAllTags(): void {
    while (this.tags.length) {
      this.tags[0].onRemove(this);
      this.eventTarget.dispatchEvent(
        new TagRemovedEvent(this.tags[0].tagType, this.tags[0].side, this.tags[0].turnCount),
      );

      this.tags.splice(0, 1);
    }
  }

  /**
   * Clears weather, terrain and arena tags when entering new biome or trainer battle.
   */
  resetArenaEffects(): void {
    // Don't reset weather if a Biome's permanent weather is active
    if (this.weather?.turnsLeft !== 0) {
      this.trySetWeather(WeatherType.NONE, false);
    }
    this.trySetTerrain(TerrainType.NONE, false, true);
    this.removeAllTags();
  }

  preloadBgm(): void {
    globalScene.loadBgm(this.bgm);
  }

  getBgmLoopPoint(): number {
    switch (this.biomeType) {
      case Biome.TOWN:
        return 7.288;
      case Biome.PLAINS:
        return 7.693;
      case Biome.GRASS:
        return 1.995;
      case Biome.TALL_GRASS:
        return 9.608;
      case Biome.METROPOLIS:
        return 4.867;
      case Biome.FOREST:
        return 4.294;
      case Biome.SEA:
        return 0.024;
      case Biome.SWAMP:
        return 4.461;
      case Biome.BEACH:
        return 3.462;
      case Biome.LAKE:
        return 5.35;
      case Biome.SEABED:
        return 2.629;
      case Biome.MOUNTAIN:
        return 4.018;
      case Biome.BADLANDS:
        return 17.79;
      case Biome.CAVE:
        return 14.24;
      case Biome.DESERT:
        return 1.143;
      case Biome.ICE_CAVE:
        return 15.01;
      case Biome.MEADOW:
        return 3.891;
      case Biome.POWER_PLANT:
        return 2.81;
      case Biome.VOLCANO:
        return 5.116;
      case Biome.GRAVEYARD:
        return 3.232;
      case Biome.DOJO:
        return 6.205;
      case Biome.FACTORY:
        return 4.985;
      case Biome.RUINS:
        return 2.27;
      case Biome.WASTELAND:
        return 6.336;
      case Biome.ABYSS:
        return 5.13;
      case Biome.SPACE:
        return 21.347;
      case Biome.CONSTRUCTION_SITE:
        return 1.222;
      case Biome.JUNGLE:
        return 2.477;
      case Biome.FAIRY_CAVE:
        return 4.542;
      case Biome.TEMPLE:
        return 2.547;
      case Biome.ISLAND:
        return 2.751;
      case Biome.LABORATORY:
        return 0.797;
      case Biome.SLUM:
        return 1.221;
      case Biome.SNOWY_FOREST:
        return 3.047;
      default:
        console.warn(`missing bgm loop-point for biome "${Biome[this.biomeType]}" (=${this.biomeType})`);
        return 0;
    }
  }
}

export function getBiomeKey(biome: Biome): string {
  return Biome[biome].toLowerCase();
}

/**
 * Props are additional sprite images present in a biome
 */
const biomeWithProps = [
  Biome.METROPOLIS,
  Biome.BEACH,
  Biome.LAKE,
  Biome.SEABED,
  Biome.MOUNTAIN,
  Biome.BADLANDS,
  Biome.CAVE,
  Biome.DESERT,
  Biome.ICE_CAVE,
  Biome.MEADOW,
  Biome.POWER_PLANT,
  Biome.VOLCANO,
  Biome.GRAVEYARD,
  Biome.FACTORY,
  Biome.RUINS,
  Biome.WASTELAND,
  Biome.ABYSS,
  Biome.CONSTRUCTION_SITE,
  Biome.JUNGLE,
  Biome.FAIRY_CAVE,
  Biome.TEMPLE,
  Biome.SNOWY_FOREST,
  Biome.ISLAND,
  Biome.LABORATORY,
  Biome.END,
];

export function getBiomeHasProps(biomeType: Biome): boolean {
  return biomeWithProps.includes(biomeType);
}

export class ArenaBase extends Phaser.GameObjects.Container {
  public player: boolean;
  public biome: Biome;
  public propValue: number;
  public base: Phaser.GameObjects.Sprite;
  public props: Phaser.GameObjects.Sprite[];

  constructor(player: boolean) {
    super(globalScene, 0, 0);

    this.player = player;

    this.base = globalScene.addFieldSprite(0, 0, "plains_a", undefined, 1);
    this.base.setOrigin(0, 0);

    this.props = !player
      ? new Array(3).fill(null).map(() => {
          const ret = globalScene.addFieldSprite(0, 0, "plains_b", undefined, 1);
          ret.setOrigin(0, 0);
          ret.setVisible(false);
          return ret;
        })
      : [];
  }

  setBiome(biome: Biome, propValue?: number): void {
    const hasProps = getBiomeHasProps(biome);
    const biomeKey = getBiomeKey(biome);
    const baseKey = `${biomeKey}_${this.player ? "a" : "b"}`;

    if (biome !== this.biome) {
      this.base.setTexture(baseKey);

      if (this.base.texture.frameTotal > 1) {
        const baseFrameNames = globalScene.anims.generateFrameNames(baseKey, {
          zeroPad: 4,
          suffix: ".png",
          start: 1,
          end: this.base.texture.frameTotal - 1,
        });
        if (!globalScene.anims.exists(baseKey)) {
          globalScene.anims.create({
            key: baseKey,
            frames: baseFrameNames,
            frameRate: 12,
            repeat: -1,
          });
        }
        this.base.play(baseKey);
      } else {
        this.base.stop();
      }

      this.add(this.base);
    }

    if (!this.player) {
      globalScene.executeWithSeedOffset(
        () => {
          this.propValue = propValue === undefined ? (hasProps ? randSeedInt(8) : 0) : propValue;
          this.props.forEach((prop, p) => {
            const propKey = `${biomeKey}_b${hasProps ? `_${p + 1}` : ""}`;
            prop.setTexture(propKey);

            if (hasProps && prop.texture.frameTotal > 1) {
              const propFrameNames = globalScene.anims.generateFrameNames(propKey, {
                zeroPad: 4,
                suffix: ".png",
                start: 1,
                end: prop.texture.frameTotal - 1,
              });
              if (!globalScene.anims.exists(propKey)) {
                globalScene.anims.create({
                  key: propKey,
                  frames: propFrameNames,
                  frameRate: 12,
                  repeat: -1,
                });
              }
              prop.play(propKey);
            } else {
              prop.stop();
            }

            prop.setVisible(hasProps && !!(this.propValue & (1 << p)));
            this.add(prop);
          });
        },
        globalScene.currentBattle?.waveIndex || 0,
        globalScene.waveSeed,
      );
    }
  }
}
