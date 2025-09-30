import { applyAbAttrs } from "#abilities/apply-ab-attrs";
import type { PostTerrainChangeAbAttr } from "#abilities/post-terrain-change-ab-attr";
import type { PostWeatherChangeAbAttr } from "#abilities/post-weather-change-ab-attr";
import type { TerrainEventTypeChangeAbAttr } from "#abilities/terrain-event-type-change-ab-attr";
import { globalScene } from "#app/global-scene";
import { activeOverrides } from "#app/overrides";
import type { ArenaTag } from "#arena-tags/arena-tag";
import type { EntryHazardTag } from "#arena-tags/entry-hazard-tag";
import { getArenaTag } from "#arena-tags/utils/get-arena-tag";
import { ENTRY_HAZARD_ARENA_TAG_TYPES } from "#constants/arena-tag-constants";
import { DEFAULT_NEW_TERRAIN_DURATION } from "#constants/game-constants";
import { DEFAULT_NEW_WEATHER_DURATION, PRIMAL_WEATHER_TYPES } from "#constants/weather-constants";
import { type BiomeTierTrainerPools, getBiomeBgm, IndoorBiomes, type PokemonPools } from "#data/biome-utils";
import { allBiomes } from "#data/data-lists";
import { SpeciesFormChangeRevertWeatherFormTrigger, SpeciesFormChangeWeatherTrigger } from "#data/pokemon-forms";
import type { PokemonSpecies } from "#data/pokemon-species";
import { getTerrainClearMessage, getTerrainStartMessage, Terrain } from "#data/terrain";
import { getWeatherClearMessage, getWeatherStartMessage, Weather } from "#data/weather";
import { AbAttrFlag } from "#enums/ab-attr-flag";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import type { ArenaTagType } from "#enums/arena-tag-type";
import type { BattlerIndex, FieldBattlerIndex } from "#enums/battler-index";
import { BiomeId } from "#enums/biome-id";
import { BiomePoolTier } from "#enums/biome-pool-tier";
import { CommonAnim } from "#enums/common-anim";
import type { ElementalType } from "#enums/elemental-type";
import type { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { TerrainType } from "#enums/terrain-type";
import { TimeOfDay } from "#enums/time-of-day";
import { TrainerType } from "#enums/trainer-type";
import { WeatherType } from "#enums/weather-type";
import { TagAddedEvent, TagRemovedEvent, TerrainChangedEvent, WeatherChangedEvent } from "#events/arena";
import type { Pokemon } from "#field/pokemon";
import type { Move } from "#moves/move";
import { coerceArray, enumValueToKey, getTSEnumValues } from "#utils/common-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import { randSeedInt, weightedPick } from "#utils/random-utils";

// TODO: remove `| null` from `weather` and `terrain`
export class Arena {
  public biomeId: BiomeId;
  public weather: Weather | null;
  public terrain: Terrain | null;
  public tags: ArenaTag[] = [];
  public bgm: string;
  public ignoreAbilities: boolean;
  public ignoringEffectSource?: FieldBattlerIndex;

  /**
   * Used to keep track of the previous TimeOfDay.
   * Only used in {@linkcode updatePoolsForTimeOfDay}
   */
  private lastTimeOfDay: TimeOfDay;

  private pokemonPool: PokemonPools;
  private readonly trainerPool: BiomeTierTrainerPools;

  public readonly eventTarget: EventTarget = new EventTarget();

  constructor(biomeId: BiomeId) {
    this.biomeId = biomeId;
    this.bgm = getBiomeBgm(biomeId);
    this.trainerPool = allBiomes.get(biomeId).trainerPool;
    this.updatePoolsForTimeOfDay();
  }

  // #region Getters

  public get terrainType(): TerrainType {
    return this.terrain?.terrainType ?? TerrainType.NONE;
  }

  public get weatherType(): WeatherType {
    return this.weather?.weatherType ?? WeatherType.NONE;
  }

  // #endregion
  // #region Misc Public Methods

  public init() {
    const biomeKey = getBiomeKey(this.biomeId);

    globalScene.arenaPlayer.setBiome(this.biomeId);
    globalScene.arenaPlayerTransition.setBiome(this.biomeId);
    globalScene.arenaEnemy.setBiome(this.biomeId);
    globalScene.arenaNextEnemy.setBiome(this.biomeId);
    globalScene.arenaBg.setTexture(`${biomeKey}_bg`);
    globalScene.arenaBgTransition.setTexture(`${biomeKey}_bg`);

    // Redo this on initialize because during save/load the current wave isn't always
    // set correctly during construction
    this.updatePoolsForTimeOfDay();
  }

  public setIgnoreAbilities(ignoreAbilities: boolean, ignoringEffectSource?: FieldBattlerIndex): void {
    this.ignoreAbilities = ignoreAbilities;
    this.ignoringEffectSource = ignoreAbilities ? ignoringEffectSource : undefined;
  }

  /**
   * Clears weather, terrain and arena tags when entering new biome or trainer battle.
   */
  public resetArenaEffects(): void {
    // Don't reset weather if a Biome's permanent weather is active
    if (this.weather?.turnsLeft !== 0) {
      this.trySetWeather(WeatherType.NONE, false);
    }

    // Don't reset terrain if a Biome's permanent terrain is active
    if (this.terrain?.turnsLeft !== 0) {
      this.trySetTerrain(TerrainType.NONE, false, true);
    }

    this.removeAllTags();
  }

  // #endregion
  // #region Misc Private Methods

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
  private generateBossBiomeTier(tierValue: number): BiomePoolTier {
    if (tierValue >= 20) {
      return BiomePoolTier.BOSS;
    }
    if (tierValue >= 6) {
      return BiomePoolTier.BOSS_RARE;
    }
    if (tierValue >= 1) {
      return BiomePoolTier.BOSS_SUPER_RARE;
    }
    return BiomePoolTier.BOSS_ULTRA_RARE;
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
  private generateNonBossBiomeTier(tierValue: number): BiomePoolTier {
    if (tierValue >= 156) {
      return BiomePoolTier.COMMON;
    }
    if (tierValue >= 32) {
      return BiomePoolTier.UNCOMMON;
    }
    if (tierValue >= 6) {
      return BiomePoolTier.RARE;
    }
    if (tierValue >= 1) {
      return BiomePoolTier.SUPER_RARE;
    }
    return BiomePoolTier.ULTRA_RARE;
  }

  // #endregion
  // #region Weather

  /**
   * Determines if one the specified weather effects is set in the arena.
   * Does **not** take into account weather suppression effects.
   * @see {@linkcode Weather.isEffectSuppressed} to check if the weather effect is suppressed.
   * @param weather - {@linkcode WeatherType} or array of {@linkcode WeatherType} to check against
   * @returns `true` if the arena is of the specified weather, `false` otherwise
   */
  public hasWeather(weather: WeatherType | WeatherType[]): boolean {
    return coerceArray(weather).includes(this.weatherType);
  }

  /**
   * Sets weather to the override specified in overrides.ts
   * @param weather new {@linkcode WeatherType} to set
   * @returns true to force trySetWeather to return true
   */
  private tryOverrideWeather(weather: WeatherType): boolean {
    this.weather = new Weather(weather, 0);
    globalScene.phaseManager.createAndUnshiftPhase("CommonAnimPhase", (CommonAnim.SUNNY + (weather - 1)) as CommonAnim);
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", getWeatherStartMessage(weather) ?? "");
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
      if (this.weather.isPrimal() && ![WeatherType.NONE, ...PRIMAL_WEATHER_TYPES].includes(newWeather)) {
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
  public trySetWeather(newWeatherType: WeatherType, hasPokemonSource: boolean): boolean {
    /**
     * TODO: Refactor into if(this.tryOverrideWeather()) { return true }
     */
    if (activeOverrides.WEATHER_OVERRIDE) {
      return this.tryOverrideWeather(activeOverrides.WEATHER_OVERRIDE);
    }

    if (!this.canSetWeather(newWeatherType)) {
      return false;
    }

    const oldWeatherType = this.weatherType;

    let newWeatherDuration = DEFAULT_NEW_WEATHER_DURATION;

    if (activeOverrides.NEW_WEATHER_DURATION_OVERRIDE >= 0) {
      newWeatherDuration = activeOverrides.NEW_WEATHER_DURATION_OVERRIDE;
    } else if (!hasPokemonSource || PRIMAL_WEATHER_TYPES.includes(newWeatherType)) {
      newWeatherDuration = 0;
    }

    if (newWeatherType !== WeatherType.NONE) {
      globalScene.phaseManager.createAndUnshiftPhase(
        "CommonAnimPhase",
        (CommonAnim.SUNNY + (newWeatherType - 1)) as CommonAnim,
      );
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", getWeatherStartMessage(newWeatherType) ?? "");
      this.weather = new Weather(newWeatherType, newWeatherDuration);
    } else {
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", getWeatherClearMessage(oldWeatherType) ?? "");
      this.weather = null;
    }

    this.eventTarget.dispatchEvent(new WeatherChangedEvent(oldWeatherType, newWeatherType, newWeatherDuration));

    globalScene
      .getField(true)
      .filter((p) => p.isOnField())
      .map((pokemon) => {
        pokemon.findAndRemoveTags(
          (tag) => "weatherTypes" in tag && !(tag.weatherTypes as WeatherType[]).find((wt) => wt === newWeatherType),
        );
        applyAbAttrs<PostWeatherChangeAbAttr>(AbAttrFlag.POST_WEATHER_CHANGE, pokemon, false, newWeatherType);
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
   * Sets a random weather based on the time of day and the current biome
   */
  public setRandomWeather(): void {
    const weatherPool = allBiomes.get(this.biomeId).weatherPool;
    const weatherMap = new Map<WeatherType, number>();
    for (const id of getTSEnumValues(WeatherType)) {
      weatherMap.set(id, weatherPool[id] ?? 0);
    }

    // If the time is dusk or night, set the chance of sun to 0
    if (([TimeOfDay.DUSK, TimeOfDay.NIGHT] as readonly TimeOfDay[]).includes(this.getTimeOfDay())) {
      weatherMap.set(WeatherType.SUNNY, 0);
    }

    const randomWeather = weightedPick(weatherMap);
    this.trySetWeather(randomWeather, false);
  }

  /**
   * Function to trigger all weather based form changes
   */
  public triggerWeatherBasedFormChanges(): void {
    globalScene.getField(true).forEach((p) => {
      const isCastformWithForecast = p.hasAbility(AbilityId.FORECAST) && p.species.speciesId === SpeciesId.CASTFORM;
      const isCherrimWithFlowerGift = p.hasAbility(AbilityId.FLOWER_GIFT) && p.species.speciesId === SpeciesId.CHERRIM;

      if (isCastformWithForecast || isCherrimWithFlowerGift) {
        // TODO: This doesn't seem to account for which ability is triggered (main vs. passive)
        globalScene.phaseManager.createAndUnshiftPhase("ShowAbilityPhase", p.getBattlerIndex());
        globalScene.triggerPokemonFormChange(p, SpeciesFormChangeWeatherTrigger);
      }
    });
  }

  /**
   * Function to trigger all weather based form changes back into their normal forms
   */
  public triggerWeatherBasedFormChangesToNormal(): void {
    globalScene.getField(true).forEach((p) => {
      const isCastformWithForecast =
        p.hasAbility(AbilityId.FORECAST, false, true) && p.species.speciesId === SpeciesId.CASTFORM;
      const isCherrimWithFlowerGift =
        p.hasAbility(AbilityId.FLOWER_GIFT, false, true) && p.species.speciesId === SpeciesId.CHERRIM;

      if (isCastformWithForecast || isCherrimWithFlowerGift) {
        // TODO: This doesn't seem to account for which ability is triggered (main vs. passive)
        globalScene.phaseManager.createAndUnshiftPhase("ShowAbilityPhase", p.getBattlerIndex());
        return globalScene.triggerPokemonFormChange(p, SpeciesFormChangeRevertWeatherFormTrigger);
      }
    });
  }

  /**
   * @param attackType - The {@linkcode ElementalType} of the attack
   * @returns The weather damage multiplier
   */
  public getWeatherDamageMultiplier(attackType: ElementalType): number {
    if (this.weather && !this.weather.isEffectSuppressed()) {
      return this.weather.getAttackTypeMultiplier(attackType);
    }
    return 1;
  }

  // #endregion
  // #region Terrain

  /**
   * Determines if one of the specified terrains is set in the arena.
   * @param terrain - {@linkcode TerrainType} or array of {@linkcode TerrainType} to check against
   * @returns `true` if the arena is of the specified terrain, `false` otherwise
   */
  public hasTerrain(terrain: TerrainType | TerrainType[]): boolean {
    return coerceArray(terrain).includes(this.terrainType);
  }

  /**
   * Sets terrain to the override specified in overrides.ts
   * @param terrain new {@linkcode TerrainType} to set
   * @returns true to force trySetTerrain to return true
   */
  private tryOverrideTerrain(terrain: TerrainType): boolean {
    this.terrain = new Terrain(terrain, 0);
    globalScene.phaseManager.createAndUnshiftPhase(
      "CommonAnimPhase",
      (CommonAnim.MISTY_TERRAIN + (terrain - 1)) as CommonAnim,
    );
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", getTerrainStartMessage(terrain) ?? "");
    return true;
  }

  /**
   * Attempts to set terrain
   * @param terrain - {@linkcode TerrainType | The type of terrain}
   * @param hasPokemonSource - Whether the terrain was generated from a Pokemon
   * @param ignoreAnim - Whether or not to ignore animations
   * @returns whether or not the terrain was successfully set
   */
  public trySetTerrain(terrain: TerrainType, hasPokemonSource: boolean, ignoreAnim: boolean = false): boolean {
    // TODO: Refactor into `if(this.tryOverrideTerrain()) { return true }`
    if (activeOverrides.TERRAIN_OVERRIDE) {
      return this.tryOverrideTerrain(activeOverrides.TERRAIN_OVERRIDE);
    }

    // TODO: create `Arena#canSetTerrain` method
    if (this.terrain?.terrainType === (terrain || undefined)) {
      return false;
    }

    const oldTerrainType = this.terrainType;

    let newTerrainDuration = DEFAULT_NEW_TERRAIN_DURATION;

    if (activeOverrides.NEW_TERRAIN_DURATION_OVERRIDE >= 0) {
      newTerrainDuration = activeOverrides.NEW_TERRAIN_DURATION_OVERRIDE;
    } else if (!hasPokemonSource) {
      newTerrainDuration = 0;
    }
    this.terrain = terrain ? new Terrain(terrain, newTerrainDuration) : null;

    if (this.terrain) {
      this.eventTarget.dispatchEvent(
        new TerrainChangedEvent(oldTerrainType, this.terrain.terrainType, this.terrain.turnsLeft),
      );
      if (!ignoreAnim) {
        globalScene.phaseManager.createAndUnshiftPhase(
          "CommonAnimPhase",
          (CommonAnim.MISTY_TERRAIN + (terrain - 1)) as CommonAnim,
        );
      }
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", getTerrainStartMessage(terrain) ?? "");
    } else {
      globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", getTerrainClearMessage(oldTerrainType) ?? "");
    }

    globalScene
      .getField(true)
      .filter((p) => p.isOnField())
      .map((pokemon) => {
        pokemon.findAndRemoveTags(
          (tag) => "terrainTypes" in tag && !(tag.terrainTypes as TerrainType[]).find((tt) => tt === terrain),
        );
        applyAbAttrs<PostTerrainChangeAbAttr>(AbAttrFlag.POST_TERRAIN_CHANGE, pokemon, false, terrain);
        applyAbAttrs<TerrainEventTypeChangeAbAttr>(AbAttrFlag.TERRAIN_EVENT_TYPE_CHANGE, pokemon, false, false);
      });

    return true;
  }

  /**
   * Checks to see if the current terrain will cancel a move
   * @param user - The Pokemon using the move
   * @param targets - The Pokemon being targetted
   * @param move - The move being used
   * @returns whether the move was cancelled by terrain
   */
  public isMoveTerrainCancelled(user: Pokemon, targets: BattlerIndex[], move: Move): boolean {
    return !!this.terrain?.isMoveTerrainCancelled(user, targets, move);
  }

  /**
   * Sets a random terrain based on the biome
   */
  public setRandomTerrain(): void {
    const terrainPool = allBiomes.get(this.biomeId).terrainPool;
    const terrainMap = new Map<TerrainType, number>();
    for (const id of Object.values(TerrainType)) {
      terrainMap.set(id, terrainPool[id] ?? 0);
    }

    const randomTerrain = weightedPick(terrainMap);
    this.trySetTerrain(randomTerrain, false);
  }

  /**
   * @param attackType - The {@linkcode ElementalType} of the attack
   * @returns The terrain damage multiplier
   */
  public getTerrainDamageMultiplier(attackType: ElementalType): number {
    return this.terrain?.getAttackTypeMultiplier(attackType) ?? 1;
  }

  // #endregion
  // #region Trainers

  /**
   * Attempts to generate a trainer for a given wave.
   * If no trainers can be found then a breeder will be returned instead.
   * @param waveIndex - The wave index
   * @param isBoss - Only true for the brutal mysterious challengers ME
   * @returns a {@linkcode TrainerType | trainer}
   */
  public randomTrainerType(waveIndex: number, isBoss: boolean = false): TrainerType {
    const isTrainerBoss =
      this.trainerPool[BiomePoolTier.BOSS].length > 0
      && (globalScene.gameMode.isTrainerBoss(waveIndex, this.biomeId) || isBoss);

    // TODO: Right now there are no super/ultra or rare boss trainers
    const tierValue = randSeedInt(isTrainerBoss ? 64 : 512);
    let tier = isTrainerBoss ? this.generateBossBiomeTier(tierValue) : this.generateNonBossBiomeTier(tierValue);

    while (tier > BiomePoolTier.COMMON && this.trainerPool[tier].length === 0) {
      console.log(
        `Downgraded trainer rarity tier from ${enumValueToKey(BiomePoolTier, tier)} to ${enumValueToKey(BiomePoolTier, (tier - 1) as BiomePoolTier)}`,
      );
      tier--;
    }
    const tierPool = this.trainerPool[tier] || [];
    return tierPool.length > 0 ? tierPool[randSeedInt(tierPool.length)] : TrainerType.BREEDER;
  }

  /**
   * Gets the denominator for the chance for a trainer spawn
   * @returns A number `n` such that the probability of a trainer battle is `1/n`.
   * Returns `0` if the {@linkcode Biome} does not support trainers; this disables random trainer spawns.
   *
   * Returns the value of {@linkcode activeOverrides.RANDOM_TRAINER_CHANCE_OVERRIDE} if it is set; this sets trainer spawn rates as above.
   * @todo possibly change the way this works so it's more flexible than just `1/n`?
   */
  public getTrainerChance(): number {
    return activeOverrides.RANDOM_TRAINER_CHANCE_OVERRIDE ?? allBiomes.get(this.biomeId).trainerChance;
  }

  // #endregion
  // #region Pokemon

  /**
   * Updates the `pokemonPool` if the time of day changes. \
   * The `pokemonPool` is a combination of a biome's `TimeOfDay.ALL` pool
   * and the pool for the specific time of day
   */
  public updatePoolsForTimeOfDay(): void {
    const timeOfDay = this.getTimeOfDay();
    if (timeOfDay !== this.lastTimeOfDay) {
      this.pokemonPool = {};
      for (const [tier, pool] of Object.entries(allBiomes.get(this.biomeId).pokemonPool)) {
        this.pokemonPool[tier] = [...pool[TimeOfDay.ALL], ...pool[timeOfDay]];
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
  public randomSpecies(waveIndex: number, level: number, attempt?: number, luckValue?: number): PokemonSpecies {
    const overrideSpecies = globalScene.gameMode.getOverrideSpecies(waveIndex);
    if (overrideSpecies) {
      return overrideSpecies;
    }

    // Boss pool is 0-63, non Boss pool is 0-512
    const isBossSpecies =
      globalScene.getEncounterBossSegments(waveIndex, level) > 0
      && this.pokemonPool[BiomePoolTier.BOSS].length > 0
      && (this.biomeId !== BiomeId.END
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
    console.log(enumValueToKey(BiomePoolTier, tier));

    // If the BiomePoolTier is empty, downgrade the rarity
    while (this.pokemonPool[tier].length === 0) {
      console.log(
        `Downgraded rarity tier from ${enumValueToKey(BiomePoolTier, tier)} to ${enumValueToKey(BiomePoolTier, (tier - 1) as BiomePoolTier)}`,
      );
      tier--;
    }
    const tierPool = this.pokemonPool[tier];
    let ret: PokemonSpecies;
    let regen = false;
    if (tierPool.length === 0) {
      ret = globalScene.randomSpecies(waveIndex, level);
    } else {
      const entry = tierPool[randSeedInt(tierPool.length)];
      ret = getPokemonSpecies(entry);
      regen = this.determineRerollIfLegendLike(ret, level);
    }

    // Attempt to retry 10 times if generated a LegendLike with an incompatible level
    if (regen && (attempt || 0) < 10) {
      console.log("Incompatible level: regenerating...");
      return this.randomSpecies(waveIndex, level, (attempt || 0) + 1);
    }

    const newSpeciesId = ret.getEnemySpeciesForLevel(level);
    if (newSpeciesId !== ret.speciesId) {
      console.log("Replaced", SpeciesId[ret.speciesId], "with", SpeciesId[newSpeciesId]);
      ret = getPokemonSpecies(newSpeciesId);
    }
    return ret;
  }

  /**
   * Determines whether or not to reroll for the given {@linkcode PokemonSpecies} and level
   *
   * - Mega/Primal/Ultra legendaries and Arceus (720) cannot spawn below level 90
   * - Most legendaries (including Regigigas but not Kyurem, Zacian and Zamazenta) cannot spawn below level 70
   * - All other sublegends cannot spawn below level 50
   * - The final base case only has Cosmoem/Cosmog
   * @returns Whether rerolling is required
   * @todo Refactor so there is no rerolling required, instead modifying the pools directly
   */
  private determineRerollIfLegendLike(pokemonSpecies: PokemonSpecies, level: number): boolean {
    if (pokemonSpecies.isLegendLike()) {
      if (pokemonSpecies.baseTotal >= 720) {
        return level < 90;
      }
      if (pokemonSpecies.baseTotal >= 670) {
        return level < 70;
      }
      if (pokemonSpecies.baseTotal >= 580) {
        return level < 50;
      }
      return level < 30;
    }
    return false;
  }

  /**
   * Generates a `formIndex` for a given species based on the biome and time of day.
   * Used for Burmy/Wormadam, Rotom, and Lycanroc
   * @param species - The {@linkcode PokemonSpecies} being checked
   * @returns the appropriate formIndex
   */
  public getSpeciesFormIndex(species: PokemonSpecies): number {
    switch (species.speciesId) {
      case SpeciesId.BURMY:
      case SpeciesId.WORMADAM:
        switch (this.biomeId) {
          case BiomeId.BEACH:
            return 1;
          case BiomeId.SLUM:
            return 2;
        }
        break;
      case SpeciesId.ROTOM:
        switch (this.biomeId) {
          case BiomeId.VOLCANO:
            return 1;
          case BiomeId.SEA:
            return 2;
          case BiomeId.ICE_CAVE:
            return 3;
          case BiomeId.MOUNTAIN:
            return 4;
          case BiomeId.TALL_GRASS:
            return 5;
        }
        break;
      case SpeciesId.LYCANROC: {
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
    }

    return 0;
  }

  // #endregion
  // #region Arena Tags

  /**
   * Applies each `ArenaTag` in this Arena, based on which side (player, enemy, or both) is passed in as a parameter
   * @param tagTypes Either an {@linkcode ArenaTagType} string, or an actual {@linkcode ArenaTag} class to filter which ones to apply
   * @param side {@linkcode ArenaTagSide} which side's arena tags to apply
   * @param simulated if `true`, this applies arena tags without changing game state
   * @param args array of parameters that the called upon tags may need
   */
  public applyTags<T extends ArenaTag = never>(
    tagTypes: ArenaTagType | ArenaTagType[],
    side: ArenaTagSide,
    ...args: Parameters<T["apply"]>
  ): void {
    const tagTypeArr = coerceArray(tagTypes);
    let tags = this.tags.filter((t) => tagTypeArr.includes(t.tagType));
    if (side !== ArenaTagSide.BOTH) {
      tags = tags.filter((t) => t.side === side);
    }
    const [simulated, ...params] = args;
    tags.forEach((t) => t.apply(simulated, ...params));
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
   * @todo `sourceId` should be optional
   */
  public addTag(
    tagType: ArenaTagType,
    sourceId: number,
    turnCount: number = 0,
    sourceMove?: MoveId,
    side: ArenaTagSide = ArenaTagSide.BOTH,
    quiet: boolean = false,
  ): boolean {
    const existingTag = this.findTag(tagType, side);
    if (existingTag) {
      existingTag.onOverlap();

      if (ENTRY_HAZARD_ARENA_TAG_TYPES.includes(existingTag.tagType)) {
        const { tagType, side, turnCount, layers, maxLayers } = existingTag as EntryHazardTag;
        this.eventTarget.dispatchEvent(new TagAddedEvent(tagType, side, turnCount, layers, maxLayers));
      }

      return false;
    }

    // creates a new tag object
    const newTag = getArenaTag(tagType, sourceId, turnCount, sourceMove, side);
    if (newTag) {
      this.tags.push(newTag);
      newTag.onAdd(quiet);

      const { layers = 0, maxLayers = 0 } = ENTRY_HAZARD_ARENA_TAG_TYPES.includes(newTag.tagType)
        ? (newTag as EntryHazardTag)
        : {};

      this.eventTarget.dispatchEvent(
        new TagAddedEvent(newTag.tagType, newTag.side, newTag.turnCount, layers, maxLayers),
      );
    }

    return true;
  }

  /**
   * Checks if an {@linkcode ArenaTag} exists on the specified side of the Arena.
   * @param tagType - The {@linkcode ArenaTagType} to check for
   * @param side - (Default `ArenaTagSide.BOTH`) The {@linkcode ArenaTagSide} to look at
   * @returns Whether the `ArenaTag` exists
   */
  public hasTag(tagType: ArenaTagType, side: ArenaTagSide = ArenaTagSide.BOTH): boolean {
    const validSides = new Set<ArenaTagSide>([ArenaTagSide.BOTH, side]);

    return this.tags.some((t) => t.tagType === tagType && (side === ArenaTagSide.BOTH || validSides.has(t.side)));
  }

  /**
   * Attempts to get a tag from the Arena from a specific side (the tag passed in has to either apply to both sides, or the specific side only)
   *
   * eg: `MIST` only applies to the user's side, while `MUD_SPORT` applies to both user and enemy side
   * @param tagType - The {@linkcode ArenaTagType} to get
   * @param side - (Default `ArenaTagSide.BOTH`) The {@linkcode ArenaTagSide} to look at
   * @returns either the {@linkcode ArenaTag}, or `undefined` if it isn't there
   */
  public findTag<T extends ArenaTag = ArenaTag>(
    tagType: ArenaTagType,
    side: ArenaTagSide = ArenaTagSide.BOTH,
  ): T | undefined {
    const validSides = new Set<ArenaTagSide>([ArenaTagSide.BOTH, side]);

    return this.tags.find((t) => tagType === t.tagType && (side === ArenaTagSide.BOTH || validSides.has(t.side))) as T;
  }

  /**
   * Returns all tags from the arena that pass the `tagPredicate` function passed in as a parameter, and apply to the given side
   * @param tagPredicate - A function mapping {@linkcode ArenaTag}s to `boolean`s
   * @param side - (Default `ArenaTagSide.BOTH`) The {@linkcode ArenaTagSide} to look at
   * @returns array of {@linkcode ArenaTag}s from which the Arena's tags return `true` and apply to the given side
   */
  public getTags<T extends ArenaTag = ArenaTag>(
    tagPredicate: (t: ArenaTag) => boolean,
    side: ArenaTagSide = ArenaTagSide.BOTH,
  ): T[] | undefined {
    const validSides = new Set<ArenaTagSide>([ArenaTagSide.BOTH, side]);

    return this.tags.filter((t) => tagPredicate(t) && (side === ArenaTagSide.BOTH || validSides.has(t.side))) as T[];
  }

  public lapseTags(): void {
    this.tags
      .filter((t) => !t.lapse())
      .forEach((t) => {
        t.onRemove();
        this.tags.splice(this.tags.indexOf(t), 1);

        this.eventTarget.dispatchEvent(new TagRemovedEvent(t.tagType, t.side, t.turnCount));
      });
  }

  public removeTag(tagType: ArenaTagType): boolean {
    const tags = this.tags;
    const tag = tags.find((t) => t.tagType === tagType);
    if (tag) {
      tag.onRemove();
      tags.splice(tags.indexOf(tag), 1);

      this.eventTarget.dispatchEvent(new TagRemovedEvent(tag.tagType, tag.side, tag.turnCount));
    }
    return !!tag;
  }

  public removeTagOnSide(tagType: ArenaTagType, side: ArenaTagSide, quiet: boolean = false): boolean {
    const tag = this.findTag(tagType, side);
    if (tag) {
      tag.onRemove(quiet);
      this.tags.splice(this.tags.indexOf(tag), 1);

      this.eventTarget.dispatchEvent(new TagRemovedEvent(tag.tagType, tag.side, tag.turnCount));
    }
    return !!tag;
  }

  public removeAllTags(): void {
    while (this.tags.length > 0) {
      this.tags[0].onRemove();
      this.eventTarget.dispatchEvent(
        new TagRemovedEvent(this.tags[0].tagType, this.tags[0].side, this.tags[0].turnCount),
      );

      this.tags.splice(0, 1);
    }
  }

  // #endregion
  // #region Time of Day

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
  public getTimeOfDay(): TimeOfDay {
    if (this.biomeId === BiomeId.ABYSS) {
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
   * Determines if the arena is of the specified time of day
   * @param timeOfDay - {@linkcode TimeOfDay} or array of {@linkcode TimeOfDay} to check against
   * @returns `true` if the arena is of the specified time of day, `false` otherwise
   */
  public isTimeOfDay(timeOfDay: TimeOfDay | TimeOfDay[]): boolean {
    return coerceArray(timeOfDay).includes(this.getTimeOfDay());
  }

  public isOutside(): boolean {
    return !IndoorBiomes.includes(this.biomeId);
  }

  // TODO: these tints feel like they belong in their own class somewhere
  // TODO: replace arena tint override with time of day override
  private overrideTint(): [number, number, number] {
    switch (activeOverrides.ARENA_TINT_OVERRIDE) {
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

  public getDayTint(): [number, number, number] {
    if (activeOverrides.ARENA_TINT_OVERRIDE !== null) {
      return this.overrideTint();
    }
    switch (this.biomeId) {
      case BiomeId.ABYSS:
        return [64, 64, 64];
      default:
        return [128, 128, 128];
    }
  }

  public getDuskTint(): [number, number, number] {
    if (activeOverrides.ARENA_TINT_OVERRIDE) {
      return this.overrideTint();
    }
    if (!this.isOutside()) {
      return [0, 0, 0];
    }

    switch (this.biomeId) {
      default:
        return [98, 48, 73].map((c) => Math.round((c + 128) / 2)) as [number, number, number];
    }
  }

  public getNightTint(): [number, number, number] {
    if (activeOverrides.ARENA_TINT_OVERRIDE) {
      return this.overrideTint();
    }
    switch (this.biomeId) {
      case BiomeId.ABYSS:
      case BiomeId.SPACE:
      case BiomeId.END:
        return this.getDayTint();
    }

    if (!this.isOutside()) {
      return [64, 64, 64];
    }

    switch (this.biomeId) {
      default:
        return [48, 48, 98];
    }
  }

  // #endregion
}

// #region Helper Functions

/**
 * @todo Make the key (`biomeId` in lower case) not what
 * generates everything including the music and image assets
 *
 * All that should also live in the biome class itself.
 */
export function getBiomeKey(biomeId: BiomeId): string {
  return enumValueToKey(BiomeId, biomeId).toLowerCase();
}

/**
 * Props are additional sprite images present in a biome
 */
const biomeWithProps = Object.freeze<BiomeId[]>([
  BiomeId.METROPOLIS,
  BiomeId.BEACH,
  BiomeId.LAKE,
  BiomeId.SEABED,
  BiomeId.MOUNTAIN,
  BiomeId.BADLANDS,
  BiomeId.CAVE,
  BiomeId.DESERT,
  BiomeId.ICE_CAVE,
  BiomeId.MEADOW,
  BiomeId.POWER_PLANT,
  BiomeId.VOLCANO,
  BiomeId.GRAVEYARD,
  BiomeId.FACTORY,
  BiomeId.RUINS,
  BiomeId.WASTELAND,
  BiomeId.ABYSS,
  BiomeId.CONSTRUCTION_SITE,
  BiomeId.JUNGLE,
  BiomeId.FAIRY_CAVE,
  BiomeId.TEMPLE,
  BiomeId.SNOWY_FOREST,
  BiomeId.ISLAND,
  BiomeId.LABORATORY,
  BiomeId.END,
]);

export function getBiomeHasProps(biomeId: BiomeId): boolean {
  return biomeWithProps.includes(biomeId);
}

/**
 * Returns a background terrain color ratio for a given biome
 * @param biomeId - The biome to check
 * @returns 0, 131/180 or 1
 */
export function getBgTerrainColorRatioForBiome(biomeId: BiomeId): number {
  switch (biomeId) {
    case BiomeId.SPACE:
      return 1;
    case BiomeId.END:
      return 0;
  }

  return 131 / 180;
}

/**
 * @param biomeId - The biome to check
 * @returns the {@linkcode Biome.bgmLoopPoint | loop point} of a biome's associated bgm in seconds
 */
export function getArenaBgmLoopPoint(biomeId: BiomeId): number {
  return allBiomes.get(biomeId).bgmLoopPoint;
}

// #endregion

// TODO: document this (what exactly is this?)
export class ArenaBase extends Phaser.GameObjects.Container {
  public player: boolean;
  public biomeId: BiomeId;
  public propValue: number;
  public base: Phaser.GameObjects.Sprite;
  public props: Phaser.GameObjects.Sprite[];

  constructor(player: boolean) {
    super(globalScene, 0, 0);

    this.player = player;

    this.base = globalScene.addFieldSprite(0, 0, "plains_a", undefined, 1);
    this.base.setOrigin(0, 0);

    this.props = [];
    if (!player) {
      for (let i = 0; i < 3; i++) {
        const ret = globalScene.addFieldSprite(0, 0, "plains_b", undefined, 1);
        ret.setOrigin(0, 0);
        ret.setVisible(false);
        this.props.push(ret);
      }
    }
  }

  setBiome(biome: BiomeId, propValue?: number): void {
    const hasProps = getBiomeHasProps(biome);
    const biomeKey = getBiomeKey(biome);
    const baseKey = `${biomeKey}_${this.player ? "a" : "b"}`;

    if (biome !== this.biomeId) {
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
