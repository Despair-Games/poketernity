import { globalScene } from "#app/global-scene";
import type {
  CompoundTrainerConfig,
  NewTrainerConfig,
  RequireOneTrainer,
  TrainerAssetKey,
  TrainerSlotMap,
} from "#data/new-trainer-config";
import { TrainerGender } from "#enums/trainer-gender";
import { type NonNullTrainerSlot, TrainerSlot } from "#enums/trainer-slot";
import type { TrainerType } from "#enums/trainer-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import { coerceArray } from "#utils/common-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import { randSeedInt } from "#utils/random-utils";
import { getPartyMemberSeedOffset, getPartyPokemonLevel, getPartyPokemonSpecies } from "#utils/trainer-utils";

// #region TrainerData

/**
 * Class for storing all data for a specific Trainer instance as derived from a
 * {@linkcode NewTrainerConfig}. When created, the Trainer's party of {@linkcode EnemyPokemon}
 * is also generated and added to {@linkcode globalScene}.
 */
export class TrainerData {
  public readonly trainerSlot: NonNullTrainerSlot;
  public readonly trainerType: TrainerType;
  public readonly name: string;
  public readonly title: string;
  public readonly spriteKey: string;
  public readonly dialogueSpriteKey?: string;
  public readonly isBoss: boolean;
  public readonly battleBgm: string;
  public readonly encounterBgm?: string;
  public readonly victoryBgm: string;
  public readonly party: EnemyPokemon[];
  public readonly moneyMultiplier: number;
  public readonly gender: TrainerGender;

  constructor(
    trainerSlot: NonNullTrainerSlot,
    config: NewTrainerConfig,
    gender?: TrainerGender,
    useSameSeedForAllTrainers: boolean = false,
  ) {
    this.trainerSlot = trainerSlot;
    this.trainerType = config.trainerType;
    this.gender = gender ?? this.initGender(config);
    this.name = this.getGenderedAsset(config, "name")!;
    this.title = this.getGenderedAsset(config, "title")!;
    this.spriteKey = this.getGenderedAsset(config, "spriteKey")!;
    this.dialogueSpriteKey = this.getGenderedAsset(config, "dialogueSpriteKey");
    this.isBoss = config.isBoss;
    this.battleBgm = config.battleBgm();
    this.encounterBgm = config.encounterBgm?.();
    this.victoryBgm = config.victoryBgm();
    this.party = this.generateParty(trainerSlot, config, useSameSeedForAllTrainers);
    this.moneyMultiplier = config.moneyMultiplier();
  }

  /**
   * Resolves the Trainer's gender which determines the pools from which the
   * Trainer's name, title, and sprite keys are extracted. The Trainer's gender
   * is determined randomly, and the chance of resolving to a specific gender is
   * proportional to the number of entries in the given config's name pool for
   * that gender, compared to other genders.
   * @param config - The {@linkcode NewTrainerConfig} used to generate the Trainer.
   * @returns The Trainer's {@linkcode TrainerGender}.
   */
  private initGender(config: NewTrainerConfig): TrainerGender {
    const supportedGenders = Object.keys(config.name).map((k) => Number(k) as TrainerGender);

    const genderWeights = supportedGenders.map((g) => config.name[g]!.length);
    let roll = randSeedInt(genderWeights.reduce((total, w) => total + w));
    for (let i = 0; i < supportedGenders.length; i++) {
      if (roll < genderWeights[i]) {
        return supportedGenders[i];
      }
      roll -= genderWeights[i];
    }
    return supportedGenders[0];
  }

  /**
   * @param config - The {@linkcode NewTrainerConfig} used to generate the asset
   * @param key - The type of asset to generate
   * @returns The asset (i18n key or path) generated corresponding to this Trainer's gender,
   * or `undefined` if no asset can be generated under the given parameters.
   * @privateRemarks {@linkcode gender} should be initialized before calling this method.
   */
  private getGenderedAsset(config: NewTrainerConfig, key: TrainerAssetKey): string | undefined {
    const assetGenerator = config[key]?.[this.gender] ?? config[key]?.[TrainerGender.DEFAULT];
    if (key !== "dialogueSpriteKey" && assetGenerator == null) {
      throw new Error(`trainer-data: Cannot find asset for ${key} (gender=${this.gender})`);
    }

    return assetGenerator?.();
  }

  /**
   * Generates the Trainer's party of {@linkcode EnemyPokemon} from the given config
   * and adds them to {@linkcode globalScene}.
   * @param trainerSlot - The {@linkcode TrainerSlot} this Trainer occupies
   * @param config - The {@linkcode NewTrainerConfig} used to generate this Trainer.
   * This method only uses the {@linkcode partyConfigs} and {@linkcode partyBaseSeedOffset} properties.
   * @param useSameSeedForAllTrainers - If `true`, RNG during Pokemon generation
   * will disregard {@linkcode trainerSlot} in its seed offset, allowing Trainers
   * in multiple slots to use the same seed.
   * @returns An array of {@linkcode EnemyPokemon} representing the Trainer's
   * party in slot order.
   * @see {@linkcode getPartyPokemonLevel}
   * @see {@linkcode getPartyPokemonSpecies}
   */
  private generateParty(
    trainerSlot: NonNullTrainerSlot,
    { partyConfigs, partyBaseSeedOffset }: NewTrainerConfig,
    useSameSeedForAllTrainers: boolean,
  ): EnemyPokemon[] {
    const party: EnemyPokemon[] = [];
    for (const config of partyConfigs) {
      if (config.condition && !config.condition()) {
        continue;
      }
      const strength = config.variableStrength
        ? coerceArray(config.variableStrength).map((strengthFn) => strengthFn())
        : coerceArray(config.strength);
      for (let i = 0; i < config.count; i++) {
        const seedOffset = getPartyMemberSeedOffset(
          trainerSlot,
          party.length,
          partyBaseSeedOffset,
          useSameSeedForAllTrainers,
        );
        globalScene.executeWithSeedOffset(() => {
          const level = getPartyPokemonLevel(strength[i] ?? strength.at(-1));
          const species = getPokemonSpecies(getPartyPokemonSpecies(level, party, config));
          party.push(globalScene.addEnemyPokemon(species, level, config, config.postProcess));
        }, seedOffset);
      }
    }

    if (party.length === 0) {
      throw new Error("No valid party members generated!");
    }
    return party;
  }
}

// #endregion
// #region CompoundTrainerData

export class CompoundTrainerData {
  public readonly trainerData: TrainerSlotMap<TrainerData>;
  public readonly title: string;

  constructor(config: CompoundTrainerConfig, genders: Partial<TrainerSlotMap<TrainerGender>> = {}) {
    for (const [slot, cfg] of Object.entries(config.configs)) {
      const trainerSlot = Number(slot) as NonNullTrainerSlot;
      this.trainerData[slot] = new TrainerData(
        trainerSlot,
        cfg,
        genders[trainerSlot],
        config.useSameSeedForAllTrainers,
      );
    }
    this.title = config.combinedTitle;
  }
}

// #endregion
// #region TrainerDataSet

/**
 * A container for the {@linkcode TrainerData} of all Trainers involved in a battle.
 * Includes getters to resolve conflicting data between multiple Trainers.
 */
export class TrainerDataSet {
  /** The {@linkcode TrainerData} of all involved Trainers, organized by {@linkcode TrainerSlot} */
  public readonly trainerData: RequireOneTrainer<TrainerData>;
  /** The title of the Trainer set, to be displayed at the start of the battle */
  public readonly title: string;

  constructor(source: TrainerData | CompoundTrainerData) {
    this.trainerData = source instanceof TrainerData ? { [TrainerSlot.TRAINER]: source } : source.trainerData;

    this.title = source.title;
  }

  /**
   * @returns `true` if this Trainer combination is considered a boss battle.
   * @remarks
   * A Compound Trainer battle is considered a boss battle if at least one of the
   * Trainers involved {@link NewTrainerConfig.isBoss | is a boss}.
   */
  public get isBoss(): boolean {
    return Object.values(this.trainerData).some((td) => td.isBoss);
  }

  /**
   * The BGM to play during the Trainers' introduction dialogue. Multi-Trainer
   * battles use the first defined encounter BGM override in slot order (if any exist).
   */
  public get encounterBgm(): string | undefined {
    return Object.values(this.trainerData).find((td) => td.encounterBgm != null)?.encounterBgm;
  }

  /**
   * The BGM to play during battle. Multi-Trainer battles always use the battle
   * BGM of the Trainer in the first slot ({@linkcode TrainerSlot.TRAINER}).
   */
  public get battleBgm(): string {
    return this.trainerData[TrainerSlot.TRAINER].battleBgm;
  }

  /**
   * The BGM to play when the Trainer(s) are defeated. Multi-Trainer battles always use
   * the victory BGM of the Trainer in the first slot ({@linkcode TrainerSlot.TRAINER}).
   */
  public get victoryBgm(): string {
    return this.trainerData[TrainerSlot.TRAINER].victoryBgm;
  }

  /**
   * The money reward multiplier for defeating all Trainers in this battle.
   * @todo Should this use the maximum money multiplier among all Trainers (current) or some other formula?
   */
  public get moneyMultiplier(): number {
    return Math.max(...Object.values(this.trainerData).map((td) => td.moneyMultiplier));
  }
}
