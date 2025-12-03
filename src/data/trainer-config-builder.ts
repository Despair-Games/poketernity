import { globalScene } from "#app/global-scene";
import type { NewTrainerConfig, TieredSpeciesPool, TrainerPartyPokemonConfig } from "#data/new-trainer-config";
import { PartyMemberStrength } from "#enums/party-member-strength";
import type { SpeciesId } from "#enums/species-id";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import type { PokemonSpeciesFilter } from "#types/ui-types";
import type { NonEmptyArray } from "#types/utility-types";
import { enumValueToKey, isBetween } from "#utils/common-utils";
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
      console.error("trainerType is not defined!");
      return false;
    }

    if (this.possibleGenders.size === 0) {
      console.error(
        "No supported genders detected. This may happen if the config's name, title, and/or sprite key(s) are not initialized.",
      );
      return false;
    }

    const requiredGenderMappedGeneratorKeys = ["name", "title", "spriteKey"] as const;
    for (const gender of this.possibleGenders) {
      for (const k of requiredGenderMappedGeneratorKeys) {
        // We know `config[k]` is defined based on default values
        if (config[k]![gender] == null) {
          console.error(`${k} does not have a matching generator for supported gender ${gender}!`);
          return false;
        }
      }

      // This should be defined based on default values
      const dialogueSpriteKey = config.dialogueSpriteKey!;
      if (Object.keys(dialogueSpriteKey).length > 0 && dialogueSpriteKey[gender] == null) {
        console.error(`dialogueSpriteKey has a defined generator, but not for supported gender ${gender}!`);
        return false;
      }
    }

    const pokemonCount = config.partyConfigs!.reduce((total, { count }) => total + count, 0);
    if (!isBetween(pokemonCount, 1, 6)) {
      console.error(`Invalid Pokemon count from config(s): ${pokemonCount}`);
      return false;
    }

    return true;
  }

  /** Validates and returns the builder's internal {@linkcode NewTrainerConfig} */
  public build(): NewTrainerConfig {
    if (!this.validate(this.config)) {
      throw new Error(`Required fields missing in generated config: ${this.config}`);
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
  public withFixedName(name: string, gender: TrainerGender = TrainerGender.MALE): this {
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
  public withNameFromPool(names: string[], gender: TrainerGender = TrainerGender.MALE): this {
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
  public withTitle(title: string, gender: TrainerGender = TrainerGender.MALE): this {
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
  public withSpriteKey(spriteKey: string, gender: TrainerGender = TrainerGender.MALE): this {
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
  public withDialogueSpriteKey(spriteKey: string, gender: TrainerGender = TrainerGender.MALE): this {
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
    return this.withFixedName("finn", TrainerGender.MALE).withFixedName("ivy", TrainerGender.FEMALE).withTitle("rival");
  }
}
