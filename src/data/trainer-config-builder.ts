import { globalScene } from "#app/global-scene";
import { activeOverrides as Overrides } from "#app/overrides";
import { GYM_LEADER_STRENGTH_TEMPLATES } from "#constants/trainer-constants";
import type { NewTrainerConfig, TieredSpeciesPool, TrainerPartyPokemonConfig } from "#data/new-trainer-config";
import type { PokemonSpecies } from "#data/pokemon-species";
import { signatureSpecies } from "#data/signature-species";
import type { ElementalType } from "#enums/elemental-type";
import { PartyMemberStrength } from "#enums/party-member-strength";
import type { SpeciesId } from "#enums/species-id";
import { type NonDefaultTrainerGender, TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import type { PokemonSpeciesFilter } from "#types/ui-types";
import type { NonEmptyArray } from "#types/utility-types";
import { coerceArray, enumValueToKey, isBetween } from "#utils/common-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import { randSeedItem } from "#utils/random-utils";

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
  strength: PartyMemberStrength.AVERAGE,
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
    partyConfigs: [],
    moneyMultiplier: () => 1,
  };

  /**
   * The {@linkcode TrainerGender | TrainerGenders} supported by this builder. This is populated
   * within API calls to initialize gender-mapped properties (e.g. {@linkcode name}).
   * When the builder is {@link validate | validated}, it ensures that
   * each gender-mapped property has defined generators for all supported genders.
   */
  private readonly possibleGenders: Set<TrainerGender> = new Set<TrainerGender>();

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

    const pokemonCount = config.partyConfigs!.reduce((total, { count }) => total + count, 0);
    if (!isBetween(pokemonCount, 1, 6)) {
      console.error(`trainer-config-builder: Invalid Pokemon count from config(s): ${pokemonCount}`);
      return false;
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
   * Appends a Pokemon according to the properties of the given
   * {@linkcode TrainerPartyPokemonConfig} to the Trainer's party.
   * @returns `this`
   */
  public withPokemonFromConfig(config: TrainerPartyPokemonConfig): this {
    this.config.partyConfigs!.push(config);
    return this;
  }

  /**
   * Appends a Pokemon from a {@linkcode TieredSpeciesPool} to the Trainer's party.
   * @returns `this`
   * @todo Add odds for each tier to this doc
   */
  public withPokemonFromTieredPool(speciesPool: TieredSpeciesPool, options: SpeciesPoolConfigOptions = {}): this {
    return this.withPokemonFromConfig({
      ...addDefaultPartyOptions(options),
      tieredSpeciesPool: speciesPool,
      allowLegendaries: true,
    });
  }

  /**
   * Appends a Pokemon of a set species to the Trainer's party.
   * @returns `this`
   */
  public withPokemon(species: SpeciesId, options: SpeciesConfigOptions = {}): this {
    return this.withPokemonFromPool([species], options);
  }

  /**
   * Appends a Pokemon from a pool of species to the Trainer's party.
   * @param speciesPool - The set of {@linkcode SpeciesId} from which the Pokemon is generated.
   * When generated, the Pokemon will be of a random species from this pool
   * @param options - The {@linkcode PartyPokemonOptions} to apply to the generated Pokemon.
   * @see {@linkcode defaultPartyConfigOptions}
   */
  public withPokemonFromPool(speciesPool: Readonly<NonEmptyArray<SpeciesId>>, options?: SpeciesPoolConfigOptions): this;
  public withPokemonFromPool(speciesPool: NonEmptyArray<SpeciesId>, options: SpeciesPoolConfigOptions = {}): this {
    return this.withPokemonFromConfig({
      ...addDefaultPartyOptions(options),
      speciesPool: [...speciesPool],
      allowLegendaries: true,
    });
  }

  /**
   * Appends a Pokemon of a {@link globalScene.randomSpecies | random species} that satisfies conditions
   * from the given filter and other parameters.
   */
  public withPokemonFromFilter(filter: PokemonSpeciesFilter, options: SpeciesFilterConfigOptions = {}): this {
    return this.withPokemonFromConfig({
      ...addDefaultPartyOptions(options),
      speciesFilter: filter,
    });
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
   * - {@linkcode signatureSpecies}, which defines fixed species pools for *N* Pokemon
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
    const sigSpecies = signatureSpecies[key]?.map((s) => coerceArray(s));
    if (sigSpecies == null) {
      throw new Error(`trainer-config-builder: ${key} is not a Gym Leader!`);
    }

    let i: number;
    for (i = 0; i < 6 - sigSpecies.length; i++) {
      this.withPokemonFromFilter(gymLeaderRandomPokemonFilter(key, specialtyTypes), {
        condition: getGymLeaderPartyPokemonCondition(i),
        variableStrength: () => getGymLeaderStrengthTemplate().at(i - 6) ?? PartyMemberStrength.AVERAGE,
      });
    }

    for (let j = 0; j < sigSpecies.length; j++) {
      this.withPokemonFromPool(sigSpecies.at(-(j + 1)) as NonEmptyArray<SpeciesId>, {
        allowDuplicates: true,
        condition: getGymLeaderPartyPokemonCondition(i + j),
        variableStrength: () => getGymLeaderStrengthTemplate()[i + j] ?? PartyMemberStrength.AVERAGE,
      });
    }

    return this.withTrainerType(TrainerType[key])
      .withFixedName(key.toLowerCase(), gender)
      .withTitle(`gym_leader${gender === TrainerGender.MALE ? "" : "_female"}`)
      .withSpriteKey(key.toLowerCase(), gender)
      .withBattleBgm(`battle_${region}_gym`)
      .withVictoryBgm("victory_gym")
      .asBoss()
      .withMoneyMultiplier(2.5);
  }

  public withPaldeaGymLeaderConfig(
    key: keyof typeof TrainerType,
    gender: NonDefaultTrainerGender,
    ...specialtyTypes: ElementalType[]
  ): this {
    // TODO: Add logic to instantly Tera the Pokemon in the last party slot
    return this.withGymLeaderConfig(key, gender, "paldea", ...specialtyTypes);
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
    const sigSpecies = signatureSpecies[key].flat();
    const firstStageSpecies = getPokemonSpecies(species.getFirstStageSpecies());
    return (
      specialtyTypes.some((t) => firstStageSpecies.isOfType(t)) && !sigSpecies.includes(firstStageSpecies.speciesId)
    );
  };
}
