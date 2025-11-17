import { globalScene } from "#app/global-scene";
import type { NewTrainerConfig } from "#data/new-trainer-config";
import type { PokemonSpecies } from "#data/pokemon-species";
import type { SpeciesId } from "#enums/species-id";
import { TrainerGender } from "#enums/trainer-gender";
import type { TrainerType } from "#enums/trainer-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { PokemonSpeciesFilter } from "#types/ui-types";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import { randSeedItem } from "#utils/random-utils";

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
    isBoss: false,
    partyGenerators: [],
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
      if (gender === TrainerGender.DEFAULT) {
        continue;
      }

      for (const k of requiredGenderMappedGeneratorKeys) {
        // We know `config[k]` is defined based on default values
        if (config[k]![gender] == null && config[k]![TrainerGender.DEFAULT] == null) {
          console.error(`${k} does not have a matching generator for supported gender ${gender}!`);
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
        console.error(`dialogueSpriteKey has a defined generator, but not for supported gender ${gender}!`);
        return false;
      }
    }

    if (config.partyGenerators!.length === 0) {
      console.error("partyGenerators is empty!");
      return false;
    }

    return true;
  }

  /** Constructs a {@linkcode NewTrainerConfig} from the builder's properties and returns it */
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
  public withFixedName(name: string, gender: TrainerGender = TrainerGender.DEFAULT): this {
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
  public withNameFromPool(names: string[], gender: TrainerGender = TrainerGender.DEFAULT): this {
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
   * @param bgm - The background music to set
   * @returns `this`
   */
  public withBattleBgm(bgm: string): this {
    this.config.battleBgm = () => bgm;
    return this;
  }

  /**
   * Sets the background music to play during the Trainer's introduction dialogue.
   * @param bgm - The background music to set
   * @returns `this`
   */
  public withEncounterBgm(bgm: string): this {
    this.config.encounterBgm = () => bgm;
    return this;
  }

  /**
   * Sets the background music to play when the Trainer is defeated.
   * @param bgm - The background music to set
   * @returns `this`
   */
  public withVictoryBgm(bgm: string): this {
    this.config.victoryBgm = () => bgm;
    return this;
  }

  /**
   * Appends a Pokemon of a set species to the Trainer's party.
   * @param species - The {@linkcode SpeciesId} of the added Pokemon
   * @param trainerSlot - (Default `TRAINER`) The {@linkcode TrainerSlot} to which the Pokemon belongs
   * @param ignoreEvolution - (Default `false`) If `true`, the generated Pokemon's final species will be identical to
   * `species` regardless of the Pokemon's level. Otherwise, the Pokemon's final species is set to
   * a stage in its evolution line that is appropriate for its level.
   * @param postProcess - (Optional) A callback that may be used to apply custom characteristics
   * to the Pokemon after it has been generated.
   */
  public withPokemon(
    species: SpeciesId,
    ignoreEvolution: boolean = false,
    postProcess?: (pokemon: EnemyPokemon) => void,
  ): this {
    return this.withPokemonFromPool([species], ignoreEvolution, postProcess);
  }

  /**
   * Appends a Pokemon from a pool of species to the Trainer's party.
   * @param speciesPool - The set of {@linkcode SpeciesId} from which the Pokemon is generated.
   * When generated, the Pokemon will be of a random species from this pool
   * @param trainerSlot - (Default `TRAINER`) The {@linkcode TrainerSlot} to which the Pokemon belongs
   * @param ignoreEvolution - (Default `false`) If `true`, the generated Pokemon's final species will be identical to
   * `species` regardless of the Pokemon's level. Otherwise, the Pokemon's final species is set to
   * a stage in its evolution line that is appropriate for its level.
   * @param postProcess - (Optional) A callback that may be used to apply custom characteristics
   * to the Pokemon after it has been generated.
   */
  public withPokemonFromPool(
    speciesPool: readonly SpeciesId[],
    ignoreEvolution: boolean = false,
    postProcess?: (pokemon: EnemyPokemon) => void,
  ): this {
    this.config.partyGenerators!.push((level, trainerSlot) => {
      let species = randSeedItem([...speciesPool]);
      if (!ignoreEvolution) {
        species = getPokemonSpecies(species).getEnemySpeciesForLevel(level, true);
      }

      return globalScene.addEnemyPokemon(
        getPokemonSpecies(species),
        level,
        trainerSlot,
        undefined,
        false,
        undefined,
        postProcess,
      );
    });

    return this;
  }

  /**
   * Appends a Pokemon of a {@link globalScene.randomSpecies | random species} that satisfies conditions
   * from the given filter and other parameters.
   */
  public withPokemonFromFilter(
    filter: PokemonSpeciesFilter,
    allowLegendaries: boolean = false,
    postProcess?: (pokemon: EnemyPokemon) => void,
  ): this {
    const speciesFilter = (species: PokemonSpecies): boolean => {
      return (allowLegendaries || !species.isLegendLike()) && !species.isTrainerForbidden() && filter(species);
    };

    this.config.partyGenerators!.push((level, trainerSlot) => {
      const waveIndex = globalScene.currentBattle.waveIndex;
      const species = getPokemonSpecies(
        globalScene.randomSpecies(waveIndex, level, false, speciesFilter).getEnemySpeciesForLevel(level, true),
      );

      return globalScene.addEnemyPokemon(species, level, trainerSlot, undefined, false, undefined, postProcess);
    });

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
   */
  public withRivalAssets(): this {
    return this.withFixedName("finn", TrainerGender.MALE)
      .withFixedName("ivy", TrainerGender.FEMALE)
      .withTitle("rival")
      .withEncounterBgm("rival")
      .withBattleBgm("battle_rival");
  }
}
