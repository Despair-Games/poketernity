import { globalScene } from "#app/global-scene";
import { activeOverrides as Overrides } from "#app/overrides";
import { ELITE_FOUR_MINIMUM_BST, GYM_LEADER_STRENGTH_TEMPLATES } from "#constants/trainer-constants";
import {
  EVIL_ADMIN_1_WAVE,
  EVIL_GRUNT_1_WAVE,
  EVIL_GRUNT_2_WAVE,
  EVIL_GRUNT_3_WAVE,
  EVIL_GRUNT_4_WAVE,
} from "#constants/wave-constants";
import { getLevelForWaveFunc } from "#data/exp";
import type { PokemonSpecies } from "#data/pokemon-species";
import { eliteFourSignatureSpecies, gymLeaderSignatureSpecies } from "#data/signature-species";
import { AiType } from "#enums/ai-type";
import type { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { PartyMemberStrength } from "#enums/party-member-strength";
import { SpeciesId } from "#enums/species-id";
import { TeraAIMode } from "#enums/tera-ai-mode";
import { type NonDefaultTrainerGender, TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import type { ModifierType } from "#modifier/modifier-type";
import type {
  LevelFunc,
  NewTrainerConfig,
  TieredSpeciesPool,
  TrainerPartyPokemonConfig,
} from "#trainers/new-trainer-config";
import type { PokemonSpeciesFilter } from "#types/ui-types";
import type { CoercibleArray, NonEmptyArray } from "#types/utility-types";
import { coerceArray, enumValueToKey, isBetween } from "#utils/common-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import { randSeedInt, randSeedItem } from "#utils/random-utils";
import { getStrengthLevelMultiplier } from "#utils/trainer-utils";

type PartyPokemonOptions = Partial<TrainerPartyPokemonConfig>;
type SpeciesPoolConfigOptions = Omit<PartyPokemonOptions, "tieredSpeciesPool" | "speciesPool" | "allowLegendaries">;
type SpeciesConfigOptions = Omit<SpeciesPoolConfigOptions, "speciesFilter" | "allowDuplicates">;
type SpeciesFilterConfigOptions = Omit<PartyPokemonOptions, "tieredSpeciesPool" | "speciesPool" | "speciesFilter">;

/**
 * The default values given to the {@linkcode PartyPokemonOptions} specified
 * for all party Pokemon generation methods.
 */
const defaultPartyConfigOptions: TrainerPartyPokemonConfig = {
  allowDuplicates: false,
  // This defaults to `false` for filter-based generation methods, but is
  // overwritten to `true` in pool-based methods. Pools presumably will not
  // include undesired legend-like Pokemon, anyway.
  allowLegendaries: false,
  levelFunc: levelByStrength(PartyMemberStrength.AVERAGE),
  count: 1,
  ignoreEvolution: false,
} as const;

/**
 * Inserts default values into the given options to form a valid config.
 * @param options - The {@linkcode PartyPokemonOptions} on which the default values are added.
 * @returns The {@linkcode TrainerPartyPokemonConfig} with the added default values.
 */
function addDefaultPartyOptions(options: PartyPokemonOptions): TrainerPartyPokemonConfig {
  return { ...defaultPartyConfigOptions, ...options };
}

// #region TrainerConfigBuilder

/**
 * Builder class for constructing a {@linkcode NewTrainerConfig} for Trainer generation.
 * This includes a chaining API to initialize the config's generators and a
 * validator to ensure all required generators are properly initialized in runtime.
 */
export class TrainerConfigBuilder {
  /**
   * The internal {@linkcode NewTrainerConfig} constructed by this builder
   */
  private readonly config: Partial<NewTrainerConfig> = {
    name: {},
    title: {},
    spriteKey: {},
    dialogueSpriteKey: {},
    battleBgm: () => "battle_trainer",
    victoryBgm: () => "victory_trainer",
    isBoss: false,
    isDouble: () => false,
    partyConfigs: [],
    useSameSeedForAllPokemon: false,
    moneyMultiplier: () => 1,
    modifierRewards: [],
    aiType: AiType.SMART,
    teraMode: TeraAIMode.NONE,
  };

  /**
   * The {@linkcode TrainerGender | TrainerGenders} supported by this builder. This is populated
   * within API calls to initialize gender-mapped properties (e.g. {@linkcode name}).
   * When the builder is {@link validate | validated}, it ensures that
   * each gender-mapped property has defined generators for all supported genders.
   */
  private readonly possibleGenders: Set<TrainerGender> = new Set<TrainerGender>();

  constructor(trainerType: TrainerType) {
    this.config.trainerType = trainerType;
  }

  /**
   * Determines if all required properties to build a {@linkcode NewTrainerConfig}
   * have been properly initialized. This also ensures
   * that each {@link possibleGenders | supported gender} has a valid generator
   * under each required property.
   *
   * @privateRemarks
   * `config` is supplied instead of using `this.config` directly so that
   * the type guard may apply.
   */
  private validate(config: Partial<NewTrainerConfig>): config is NewTrainerConfig {
    if (config.trainerType == null) {
      console.error("trainer-config-builder: trainerType is not defined!");
      return false;
    }

    if (this.possibleGenders.size === 0) {
      console.error(
        "trainer-config-builder: No supported genders detected. This may happen if the config's name, title, and/or sprite key(s) are not initialized.",
      );
      return false;
    }

    const requiredGenderMappedGeneratorKeys = ["name", "title", "spriteKey"] as const;
    for (const gender of this.possibleGenders) {
      if (gender === TrainerGender.DEFAULT) {
        continue;
      }

      for (const k of requiredGenderMappedGeneratorKeys) {
        // We know `config[k]` is defined based on default values
        if (config[k]![gender] == null && config[k]![TrainerGender.DEFAULT] == null) {
          console.error(
            `trainer-config-builder: ${k} does not have a matching generator for supported gender ${gender}!`,
          );
          return false;
        }
      }

      // This should be defined based on default values
      const dialogueSpriteKey = config.dialogueSpriteKey!;
      if (
        Object.keys(dialogueSpriteKey).length > 0
        && dialogueSpriteKey[gender] == null
        && dialogueSpriteKey[TrainerGender.DEFAULT] == null
      ) {
        console.error(
          `trainer-config-builder: dialogueSpriteKey has a defined generator, but not for supported gender ${gender}!`,
        );
        return false;
      }
    }

    const pokemonCount = config.partyConfigs!.reduce(
      (total, cfgs) => total + cfgs.reduce((maxCount, { count }) => Math.max(maxCount, count), 0),
      0,
    );
    if (!isBetween(pokemonCount, 1, 6)) {
      console.warn(`trainer-config-builder: Invalid Pokemon count from config(s): ${pokemonCount}`);
    }

    return true;
  }

  /** Validates and returns the builder's internal {@linkcode NewTrainerConfig} */
  public build(): NewTrainerConfig {
    if (!this.validate(this.config)) {
      throw new Error(`trainer-config-builder: Required fields missing in generated config: ${this.config}`);
    }
    return this.config;
  }

  /**
   * Sets a {@linkcode TrainerType} for Trainers generated from this config.
   * @param trainerType - The {@linkcode TrainerType} to set
   * @returns `this`
   */
  public withTrainerType(trainerType: TrainerType): this {
    this.config.trainerType = trainerType;
    return this;
  }

  /**
   * Sets a singular name for the Trainer under the specified {@linkcode TrainerGender}.
   * @param name - The name to set. Should be a localizable `i18n` key
   * @param gender - The {@linkcode TrainerGender} under which the name is assigned
   * @returns `this`
   */
  public withFixedName(name: string, gender: NonDefaultTrainerGender): this {
    this.possibleGenders.add(gender);
    this.config.name![gender] = () => name;
    return this;
  }

  /**
   * Sets a random name for the Trainer out of the given name pool
   * and under the specified {@linkcode Gender}.
   * @param names - A set of possible names. Each name should be a localizable `i18n` key.
   * @param gender - The {@linkcode TrainerGender} under which the name is assigned
   * @returns `this`
   */
  public withNameFromPool(names: string[], gender: NonDefaultTrainerGender): this {
    this.possibleGenders.add(gender);
    this.config.name![gender] = () => randSeedItem(names);
    return this;
  }

  /**
   * Sets a title for the Trainer under the specified {@linkcode TrainerGender}.
   * @param title - The title to set. Should be a localizable `i18n` key
   * @param gender - The {@linkcode TrainerGender} under which the title is assigned
   * @returns `this`
   */
  public withTitle(title: string, gender: TrainerGender = TrainerGender.DEFAULT): this {
    this.possibleGenders.add(gender);
    this.config.title![gender] = () => title;
    return this;
  }

  /**
   * Sets a sprite key for the Trainer under the specified {@linkcode TrainerGender}.
   * @param spriteKey - The sprite key to set.
   * @param gender - The {@linkcode TrainerGender} under which the sprite key is assigned
   * @returns `this`
   */
  public withSpriteKey(spriteKey: string, gender: TrainerGender = TrainerGender.DEFAULT): this {
    this.possibleGenders.add(gender);
    this.config.spriteKey![gender] = () => spriteKey;
    return this;
  }

  /**
   * Sets a sprite key for the Trainer's "close-up" image to show during the
   * Trainer's dialogue.
   * @param spriteKey - The sprite key to set
   * @param gender - The {@linkcode TrainerGender} under which the sprite key is assigned
   * @returns `this`
   */
  public withDialogueSpriteKey(spriteKey: string, gender: TrainerGender = TrainerGender.DEFAULT): this {
    this.possibleGenders.add(gender);
    this.config.dialogueSpriteKey![gender] = () => spriteKey;
    return this;
  }

  /**
   * Sets the background music to play when battling the Trainer.
   * @param bgm - The background music to set. This may be a {@linkcode TrainerType}
   * or a path or filename. A `TrainerType` input is equivalent to the path
   * `"battle_"` + the `TrainerType`'s key in snake-case, e.g.
   * ```
   * withBattleBgm(TrainerType.ACE_TRAINER)
   * ```
   * is equivalent to
   * ```
   * withBattleBgm("battle_ace_trainer")
   * ```
   * @returns `this`
   */
  public withBattleBgm(bgm: TrainerType | string): this {
    const bgmString = typeof bgm === "number" ? `battle_${enumValueToKey(TrainerType, bgm).toLowerCase()}` : bgm;
    this.config.battleBgm = () => bgmString;
    return this;
  }

  /**
   * Sets the background music to play during the Trainer's introduction dialogue.
   * @param bgm - The background music to set. This may be a {@linkcode TrainerType}
   * or a direct path. A `TrainerType` input is equivalent to the path
   * `"encounter_"` + the `TrainerType`'s key in snake-case, e.g.
   * ```
   * withEncounterBgm(TrainerType.ACE_TRAINER)
   * ```
   * is equivalent to
   * ```
   * withEncounterBgm("encounter_ace_trainer")
   * ```
   * @returns `this`
   */
  public withEncounterBgm(bgm: TrainerType | string): this {
    const bgmString = typeof bgm === "number" ? `encounter_${enumValueToKey(TrainerType, bgm).toLowerCase()}` : bgm;
    this.config.encounterBgm = () => bgmString;
    return this;
  }

  /**
   * Sets the background music to play when the Trainer is defeated.
   * @param bgm - The background music to set. This may be a {@linkcode TrainerType}
   * or a direct path. A `TrainerType` input is equivalent to the path
   * `"victory_"` + the `TrainerType`'s key in snake-case, e.g.
   * ```
   * withVictoryBgm(TrainerType.ACE_TRAINER)
   * ```
   * is equivalent to
   * ```
   * withVictoryBgm("victory_ace_trainer")
   * ```
   * @returns `this`
   */
  public withVictoryBgm(bgm: TrainerType | string): this {
    const bgmString = typeof bgm === "number" ? `victory_${enumValueToKey(TrainerType, bgm).toLowerCase()}` : bgm;
    this.config.victoryBgm = () => bgmString;
    return this;
  }

  /**
   * Sets this Trainer as a "boss" Trainer.
   * @returns `this`
   */
  public asBoss(): this {
    this.config.isBoss = true;
    return this;
  }

  /**
   * Sets this Trainer's battle to always be a double battle.
   * @returns `this`
   */
  public withForcedDoubleBattle(): this {
    this.config.isDouble = () => true;
    return this;
  }

  /**
   * Gives this Trainer a probability of `chance / denominator` for its battle to be a double battle.
   * `chance` should always be less than `denominator`. `denominator` is 100 by default.
   * @returns `this`
   */
  public withDoubleBattleChance(chance: number, denominator: number = 100): this {
    this.config.isDouble = () => randSeedInt(denominator) < chance;
    return this;
  }

  /**
   * Toggles {@linkcode NewTrainerConfig.useSameSeedForAllPokemon | useSameSeedForAllPokemon}
   * to force correlation between the Trainer's Pokemon when selecting their species
   * from species pools.
   *
   * Example: If one Pokemon's species is selected from the untiered pool `[BULBASAUR, CHARMANDER, SQUIRTLE]`
   * and another is selected from the pool `[CHIKORITA, CYNDAQUIL, TOTODILE]`, the only possible combinations
   * of species under this setting would be Bulbasaur/Chikorita, Charmander/Cyndaquil, and Squirtle/Totodile.
   * @returns `this`
   */
  public withPartyCorrelation(): this {
    this.config.useSameSeedForAllPokemon = true;
    return this;
  }

  /**
   * Appends a Pokemon according to the properties of the given
   * {@linkcode TrainerPartyPokemonConfig} to the Trainer's party.
   * If multiple configs are given as input, only one will be randomly selected
   * for the Trainer's party
   * @returns `this`
   */
  public withPokemonFromConfig(...configs: NonEmptyArray<TrainerPartyPokemonConfig>): this {
    this.config.partyConfigs!.push([...configs]);
    return this;
  }

  /**
   * Appends a Pokemon from a {@linkcode TieredSpeciesPool} to the Trainer's party.
   * @returns `this`
   * @todo Add odds for each tier to this doc
   */
  public withPokemonFromTieredPool(speciesPool: TieredSpeciesPool, ...options: SpeciesPoolConfigOptions[]): this {
    const configs =
      options.length === 0
        ? [
            {
              ...addDefaultPartyOptions({
                tieredSpeciesPool: speciesPool,
                allowLegendaries: true,
              }),
            },
          ]
        : options.map((o) => ({
            ...addDefaultPartyOptions(o),
            tieredSpeciesPool: speciesPool,
            allowLegendaries: true,
          }));
    return this.withPokemonFromConfig(configs[0], ...configs.slice(1));
  }

  /**
   * Appends a Pokemon of a set species to the Trainer's party.
   * @returns `this`
   */
  public withPokemon(species: SpeciesId, ...options: SpeciesConfigOptions[]): this {
    return this.withPokemonFromPool([species], ...options);
  }

  /**
   * Appends a Pokemon from a pool of species to the Trainer's party.
   * @param speciesPool - The set of {@linkcode SpeciesId} from which the Pokemon is generated.
   * When generated, the Pokemon will be of a random species from this pool
   * @param options - The {@linkcode PartyPokemonOptions} to apply to the generated Pokemon.
   * @see {@linkcode defaultPartyConfigOptions}
   */
  public withPokemonFromPool(
    speciesPool: Readonly<NonEmptyArray<SpeciesId>>,
    ...options: SpeciesPoolConfigOptions[]
  ): this;
  public withPokemonFromPool(speciesPool: NonEmptyArray<SpeciesId>, ...options: SpeciesPoolConfigOptions[]): this {
    const configs =
      options.length === 0
        ? [addDefaultPartyOptions({ speciesPool, allowLegendaries: true })]
        : options.map((o) => ({
            ...addDefaultPartyOptions(o),
            speciesPool,
            allowLegendaries: true,
          }));
    return this.withPokemonFromConfig(configs[0], ...configs.slice(1));
  }

  /**
   * Appends a Pokemon of a {@link globalScene.randomSpecies | random species} that satisfies conditions
   * from the given filter and other parameters.
   */
  public withPokemonFromFilter(speciesFilter: PokemonSpeciesFilter, ...options: SpeciesFilterConfigOptions[]): this {
    const configs =
      options.length === 0
        ? [addDefaultPartyOptions({ speciesFilter })]
        : options.map((o) => addDefaultPartyOptions({ ...o, speciesFilter }));
    return this.withPokemonFromConfig(configs[0], ...configs.slice(1));
  }

  public withRandomPokemon(...options: SpeciesFilterConfigOptions[]): this {
    const configs =
      options.length === 0
        ? [addDefaultPartyOptions({ speciesFilter: () => true })]
        : options.map((o) => addDefaultPartyOptions({ ...o, speciesFilter: () => true }));
    return this.withPokemonFromConfig(configs[0], ...configs.slice(1));
  }

  /**
   * Sets a fixed base seed offset when generating the Trainer's party. Can be
   * used for static party generation across multiple configs.
   * @param offset - The base seed offset to set.
   * @returns `this`
   * @see {@linkcode NewTrainerConfig.partyBaseSeedOffset}
   * @remarks
   * For organization purposes, it's best to set `offset` to a {@linkcode TrainerType},
   * but any number input is valid.
   */
  public withPartySeedOffset(offset: number): this {
    this.config.partyBaseSeedOffset = offset;
    return this;
  }

  /**
   * Sets a fixed multiplier for the money reward for defeating the Trainer.
   * @param multiplier - The multiplier to set
   * @returns `this`
   */
  public withMoneyMultiplier(multiplier: number): this {
    this.config.moneyMultiplier = () => multiplier;
    return this;
  }

  /**
   * Adds an item reward of a fixed type for defeating the Trainer.
   * @param modifierType - The {@linkcode ModifierType} of the item reward
   * @returns `this`
   */
  public withModifierReward(modifierType: ModifierType): this {
    this.config.modifierRewards!.push(() => modifierType);
    return this;
  }

  /**
   * Sets the Trainer's AI type to apply to all Pokemon by default.
   * @param aiType - The {@linkcode AiType} to apply
   * @returns `this`
   */
  public withAiType(aiType: AiType): this {
    this.config.aiType = aiType;
    return this;
  }

  /**
   * Sets the Trainer's Tera mode, which determines when the Trainer
   * will Terastallize its Pokemon.
   * @param teraMode - The {@linkcode TeraAIMode} to set
   * @returns `this`
   */
  public withTeraMode(teraMode: TeraAIMode): this {
    this.config.teraMode = teraMode;
    return this;
  }

  /**
   * Sets the config to use the Rival character's assets
   * (i.e. name, title, sprite keys, and bgm).
   * @returns `this`
   * @todo Add sprite keys
   */
  public withRivalAssets(): this {
    return this.withFixedName("finn", TrainerGender.MALE)
      .withFixedName("ivy", TrainerGender.FEMALE)
      .withTitle("rival")
      .withSpriteKey("rival_m", TrainerGender.MALE)
      .withSpriteKey("rival_f", TrainerGender.FEMALE);
  }

  /**
   * Adds the assets and party generators for the Gym Leader of the given key.
   *
   * Gym Leaders' parties are generated based on three constant data structures:
   * - {@linkcode gymLeaderSignatureSpecies}, which defines fixed species pools for *N* Pokemon
   * in the Gym Leader's party.
   * - {@linkcode specialtyTypes}, which is used to filter randomly generated
   * species for the remaining *(6 - N)* Pokemon.
   * - {@linkcode GYM_LEADER_STRENGTH_TEMPLATES}, which defines the Gym Leader's
   * party size and {@link PartyMemberStrength | strength} levels based on the
   * current wave index.
   *
   * A Gym Leader's full party consists of the *(6 - N)* randomly generated Pokemon
   * followed by the *N* Pokemon derived from {@linkcode signatureSpecies} in reverse order.
   * However, if *S* is the length of the strength template corresponding to the current wave,
   * then only the last *S* party Pokemon are included in the Gym Leader's party for the battle.
   * @param key - The key of the Gym Leader's {@linkcode TrainerType}, e.g. `"BROCK"`
   * @param gender - The Gym Leader's gender
   * @param specialtyTypes - The Gym Leader's preferred {@linkcode ElementalType}(s). Randomly
   * generated Pokemon outside of {@linkcode signatureSpecies} will be at least
   * one of these types.
   * @returns `this`
   * @todo
   * - Narrow `key` down to gym leader {@linkcode TrainerType}s
   * - Should `region` use an enum?
   */
  public withGymLeaderConfig(
    key: keyof typeof TrainerType,
    gender: NonDefaultTrainerGender,
    region: string,
    ...specialtyTypes: ElementalType[]
  ) {
    const sigSpecies = gymLeaderSignatureSpecies[key]?.map((s) => coerceArray(s));
    if (sigSpecies == null) {
      throw new Error(`trainer-config-builder: ${key} is not a Gym Leader!`);
    }

    let i: number;
    for (i = 0; i < 6 - sigSpecies.length; i++) {
      this.withPokemonFromFilter(gymLeaderRandomPokemonFilter(key, specialtyTypes), {
        condition: getGymLeaderPartyPokemonCondition(i),
        levelFunc: levelByStrength(() => getGymLeaderStrengthTemplate().at(i - 6) ?? PartyMemberStrength.AVERAGE),
      });
    }

    for (let j = 0; j < sigSpecies.length; j++) {
      this.withPokemonFromPool(sigSpecies.at(-(j + 1)) as NonEmptyArray<SpeciesId>, {
        allowDuplicates: true,
        condition: getGymLeaderPartyPokemonCondition(i + j),
        levelFunc: levelByStrength(() => getGymLeaderStrengthTemplate()[i + j] ?? PartyMemberStrength.AVERAGE),
      });
    }

    return this.withFixedName(key.toLowerCase(), gender)
      .withTitle(`trainerTitles:gym_leader${gender === TrainerGender.MALE ? "" : "_female"}`)
      .withSpriteKey(key.toLowerCase(), gender)
      .withBattleBgm(`battle_${region}_gym`)
      .withVictoryBgm("victory_gym")
      .asBoss()
      .withMoneyMultiplier(2.5);
  }

  /**
   * Adds the assets and generators for the Paldean Gym Leader of the given key.
   * This follows the same process as {@linkcode withGymLeaderConfig}, except that
   * the Paldean Gym Leader's final Pokemon is configured to instantly Terastallize
   * into the Gym Leader's specialty type.
   * @param key - The key of the Paldean Gym Leader's {@linkcode TrainerType}, e.g. "IONO"
   * @param gender - The Gym Leader's {@linkcode TrainerGender}
   * @param specialtyTypes - The Gym Leader's preferred {@linkcode ElementalType}(s).
   * Randomly generated Pokemon outside of {@linkcode signatureSpecies} will be
   * at least one of these types, and the Gym Leader's final Pokemon will
   * instantly Terastallize into the first specified type.
   * @returns `this`
   */
  public withPaldeaGymLeaderConfig(
    key: keyof typeof TrainerType,
    gender: NonDefaultTrainerGender,
    ...specialtyTypes: ElementalType[]
  ): this {
    this.withTeraMode(TeraAIMode.INSTANT).withGymLeaderConfig(key, gender, "paldea", ...specialtyTypes);
    const signaturePokemonCfg = this.config.partyConfigs!.at(-1)![0];
    signaturePokemonCfg.teraType = specialtyTypes[0];
    signaturePokemonCfg.instantTera = true;

    return this;
  }

  /**
   * Adds the assets and party generators for the Elite Four member of the given key.
   *
   * Elite Four members' parties broadly consist of the following:
   * - *N* Pokemon whose species are obtained from {@linkcode eliteFourSignatureSpecies}
   * - *(6 - N)* Pokemon of random species such that
   *   - The Pokemon's BST is greater than or equal to {@linkcode ELITE_FOUR_MINIMUM_BST}
   *   - At least one of the Pokemon's type(s) match one of the Trainer's
   *     signature type(s).
   *
   * The *N* signature Pokemon are loaded into the back of the Trainer's party
   * in reverse order of where they are defined in {@linkcode eliteFourSignatureSpecies},
   * and the *(6 - N)* random Pokemon are loaded into the front.
   * @param key - The key of the Elite Four member's {@linkcode TrainerType}, e.g. `"KOGA"`
   * @param gender - The Elite Four member's {@linkcode TrainerGender}
   * @param specialtyTypes - The Elite Four member's preferred {@linkcode ElementalType}(s).
   * Randomly generated Pokemon will be of at least one of these types.
   * @returns `this`
   */
  public withEliteFourConfig(
    key: keyof typeof TrainerType,
    gender: NonDefaultTrainerGender,
    ...specialtyTypes: NonEmptyArray<ElementalType>
  ): this {
    const sigSpecies = eliteFourSignatureSpecies[key]
      ?.map((s) => coerceArray(s) as NonEmptyArray<SpeciesId>)
      .toReversed();

    if (sigSpecies == null) {
      throw new Error(`trainer-config-builder: ${key} is not an Elite Four member!`);
    }

    const partyStrengths = [
      PartyMemberStrength.AVERAGE,
      PartyMemberStrength.AVERAGE,
      PartyMemberStrength.AVERAGE,
      PartyMemberStrength.STRONG,
      PartyMemberStrength.STRONG,
      PartyMemberStrength.STRONGER,
    ];

    const nonSignatureSpeciesSlots = 6 - sigSpecies.length;
    if (nonSignatureSpeciesSlots > 0) {
      this.withPokemonFromFilter(
        (s) => specialtyTypes.some((t) => s.isOfType(t)) && s.baseTotal >= ELITE_FOUR_MINIMUM_BST,
        {
          count: nonSignatureSpeciesSlots,
          levelFunc: levelByStrength(partyStrengths.slice(0, nonSignatureSpeciesSlots)),
        },
      );
    }

    for (let i = 0; i < sigSpecies.length; i++) {
      this.withPokemonFromPool(sigSpecies[i], {
        levelFunc: levelByStrength(partyStrengths[nonSignatureSpeciesSlots + i]),
      });
    }

    const name = key.toLowerCase();
    return this.withFixedName(name, gender)
      .withTitle(`trainerTitles:elite_four${gender === TrainerGender.MALE ? "" : "_female"}`)
      .withSpriteKey(name)
      .withVictoryBgm("victory_gym")
      .withMoneyMultiplier(3.25)
      .asBoss();
  }

  /**
   * Adds the configs for an Evil Team Grunt's party, which has varying size
   * and strength based on the current wave.
   * @param speciesPool - The Grunt's {@linkcode TieredSpeciesPool}
   * @returns `this`
   */
  public withEvilTeamGruntParty(speciesPool: TieredSpeciesPool): this {
    return this.withPokemonFromTieredPool(
      speciesPool,
      {
        condition: () => (globalScene.currentBattle?.waveIndex ?? 0) <= EVIL_GRUNT_1_WAVE,
        count: 2, // 2 Average
      },
      {
        condition: () => isBetween(globalScene.currentBattle?.waveIndex ?? 0, EVIL_GRUNT_1_WAVE + 1, EVIL_GRUNT_2_WAVE),
        count: 3, // 3 Average
      },
      {
        condition: () => isBetween(globalScene.currentBattle?.waveIndex ?? 0, EVIL_GRUNT_2_WAVE + 1, EVIL_GRUNT_3_WAVE),
        count: 3,
        levelFunc: levelByStrength([
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.STRONG,
        ]),
      },
      {
        condition: () =>
          isBetween(globalScene.currentBattle?.waveIndex ?? 0, EVIL_GRUNT_3_WAVE + 1, EVIL_GRUNT_4_WAVE - 1),
        count: 5,
        levelFunc: levelByStrength([
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.STRONG,
          PartyMemberStrength.STRONGER,
        ]),
      },
      {
        condition: () => (globalScene.currentBattle?.waveIndex ?? 0) >= EVIL_GRUNT_4_WAVE,
        count: 6,
        levelFunc: levelByStrength([
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.STRONG,
          PartyMemberStrength.STRONG,
          PartyMemberStrength.STRONGER,
        ]),
      },
    );
  }

  /**
   * Adds the configs for an Evil Team Admin's party, which broadly consists of:
   * - 4-5 Pokemon of varying strength from a tiered {@linkcode speciesPool}
   * - A Pokemon of the Admin's {@linkcode sigSpecies}
   * @returns `this`
   */
  public withEvilTeamAdminParty(speciesPool: TieredSpeciesPool, sigSpecies: SpeciesId): this {
    return this.withPokemonFromTieredPool(
      speciesPool,
      {
        condition: () => (globalScene.currentBattle?.waveIndex ?? 0) <= EVIL_ADMIN_1_WAVE,
        count: 4,
        levelFunc: levelByStrength([
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.STRONG,
        ]),
      },
      {
        condition: () => (globalScene.currentBattle?.waveIndex ?? 0) > EVIL_ADMIN_1_WAVE,
        count: 5,
        levelFunc: levelByStrength([
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.STRONG,
          PartyMemberStrength.STRONG,
        ]),
      },
    ).withPokemon(sigSpecies, { levelFunc: levelByStrength(PartyMemberStrength.STRONGER) });
  }

  /**
   * Adds the configs for a Team Star Admin's party, which broadly consists of:
   * - 3-4 Pokemon of varying strength from a tiered {@linkcode speciesPool}
   * - A Pokemon of the Admin's {@linkcode sigSpecies}
   * - A Revavroom of the given {@linkcode starmobileForm} with the following moveset:
   *   - Spin Out
   *   - Shift Gear
   *   - High Horsepower
   *   - The Starmobile form's signature "Torque" move
   * @returns `this`
   * @see {@linkcode getStarmobileSignatureMove}
   */
  public withTeamStarAdminParty(speciesPool: TieredSpeciesPool, sigSpecies: SpeciesId, starmobileForm: number): this {
    const starmobileMoveset = [
      MoveId.SPIN_OUT,
      MoveId.SHIFT_GEAR,
      MoveId.HIGH_HORSEPOWER,
      this.getStarmobileSignatureMove(starmobileForm),
    ];

    return this.withPokemonFromTieredPool(
      speciesPool,
      {
        condition: () => (globalScene.currentBattle?.waveIndex ?? 0) <= EVIL_ADMIN_1_WAVE,
        count: 3,
      },
      {
        condition: () => (globalScene.currentBattle?.waveIndex ?? 0) > EVIL_ADMIN_1_WAVE,
        count: 4,
        levelFunc: levelByStrength([
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.AVERAGE,
          PartyMemberStrength.STRONG,
        ]),
      },
    )
      .withPokemon(sigSpecies, { levelFunc: levelByStrength(PartyMemberStrength.STRONG) })
      .withPokemon(SpeciesId.REVAVROOM, {
        formIndex: starmobileForm,
        levelFunc: levelByStrength(PartyMemberStrength.STRONG),
        moveset: starmobileMoveset,
      });
  }

  /**
   * Obtains the matching signature "Torque" move for the given Starmobile form.
   * @param formIndex - The form index for the desired Starmobile
   * @returns the {@linkcode MoveId} of the signature move
   */
  private getStarmobileSignatureMove(formIndex: number): MoveId {
    switch (formIndex) {
      case 1: // Segin Starmobile
        return MoveId.WICKED_TORQUE;
      case 2: // Schedar Starmobile
        return MoveId.BLAZING_TORQUE;
      case 3: // Navi Starmobile
        return MoveId.NOXIOUS_TORQUE;
      case 4: // Ruchbah Starmobile
        return MoveId.MAGICAL_TORQUE;
      case 5: // Caph Starmobile
        return MoveId.COMBAT_TORQUE;
      default:
        console.warn("Invalid Starmobile form found in Star Admin config");
        return MoveId.NONE;
    }
  }
}

/**
 * @returns The element of {@linkcode GYM_LEADER_STRENGTH_TEMPLATES} corresponding to
 * the current wave. In Classic mode, the template used for Gym Leader party
 * generation advances to the next index every 20 waves.
 */
function getGymLeaderStrengthTemplate(): PartyMemberStrength[] {
  const currentWave = globalScene.currentBattle.waveIndex ?? Overrides.STARTING_WAVE_OVERRIDE;
  const gymLeaderIndex = Math.min(Math.ceil(currentWave / 20), 8) - 1;
  return GYM_LEADER_STRENGTH_TEMPLATES[gymLeaderIndex];
}

/**
 * @param slotIndex - The index of the generated Pokemon in the Gym Leader's party,
 * assuming the entire party is generated.
 * @returns A condition function such that, if *S* is the size of the Gym Leader
 * Strength Template for the current wave, only the last *S* {@linkcode TrainerPartyPokemonConfig}s
 * will generate Pokemon.
 * @see {@linkcode getGymLeaderStrengthTemplate}
 */
function getGymLeaderPartyPokemonCondition(slotIndex: number): () => boolean {
  return () => {
    const strengthTemplate = getGymLeaderStrengthTemplate();
    return strengthTemplate.length >= 6 - slotIndex;
  };
}

function gymLeaderRandomPokemonFilter(
  key: keyof typeof TrainerType,
  specialtyTypes: ElementalType[],
): (species: PokemonSpecies) => boolean {
  return (species) => {
    const sigSpecies = gymLeaderSignatureSpecies[key].flat();
    const firstStageSpecies = getPokemonSpecies(species.getFirstStageSpecies());
    return (
      specialtyTypes.some((t) => firstStageSpecies.isOfType(t)) && !sigSpecies.includes(firstStageSpecies.speciesId)
    );
  };
}

/**
 * Determines the level(s) of one or more Pokemon in a Trainer's party
 * based on fixed or variable {@linkcode PartyMemberStrength}(s).
 * @param strength - The {@linkcode PartyMemberStrength}(s) of the party Pokemon.
 * This may also include functions for variable strength.
 * @returns The generator function(s) to determine the party Pokemon's level(s).
 */
export function levelByStrength(
  strength: CoercibleArray<PartyMemberStrength | (() => PartyMemberStrength)>,
): LevelFunc[] {
  const levelFuncs: LevelFunc[] = [];

  for (const s of coerceArray(strength)) {
    const str = typeof s === "function" ? s() : s;

    levelFuncs.push((waveIndex: number) => {
      const baseLevel = getLevelForWaveFunc(waveIndex);
      let multiplier = getStrengthLevelMultiplier(str);
      let levelOffset = 0;

      /**
       * If the strength is WEAKER, WEAK, or AVERAGE,
       * The multiplier is increased by .025 for every 25 scaled waves, with a max cap of 1.2
       * This means that at a scaled wave index of 200 or higher multiplier will always be 1.2
       *
       * A negative level offset is then applied with a base of -1 for every 50 scaled waves,
       * further scaled by 4 - the scaled multiplier
       */
      if (str < PartyMemberStrength.STRONG) {
        multiplier = Math.min(multiplier + 0.025 * Math.floor(waveIndex / 25), 1.2);
        levelOffset = -Math.floor((waveIndex / 50) * (4 - str));
      }

      return Math.ceil(baseLevel * multiplier) + levelOffset;
    });
  }

  return levelFuncs;
}

export function minWaveCondition(waveIndex: number): () => boolean {
  return () => {
    const { currentBattle, gameMode } = globalScene;
    const startingWave = Overrides.STARTING_WAVE_OVERRIDE ?? 1;
    const adjustedWave = gameMode.getWaveForDifficulty(currentBattle?.waveIndex ?? startingWave, true);

    return adjustedWave >= waveIndex;
  };
}
