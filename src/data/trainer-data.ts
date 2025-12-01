import { globalScene } from "#app/global-scene";
import type { NewTrainerConfig } from "#data/new-trainer-config";
import type { TrainerGender } from "#enums/trainer-gender";
import type { NonNullTrainerSlot } from "#enums/trainer-slot";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import { coerceArray } from "#utils/common-utils";
import { getPokemonSpecies } from "#utils/pokemon-utils";
import { randSeedInt } from "#utils/random-utils";
import { getPartyPokemonLevel, getPartyPokemonSpecies } from "#utils/trainer-utils";

export class TrainerData {
  public readonly trainerSlot: NonNullTrainerSlot;
  public readonly name: string;
  public readonly title: string;
  public readonly spriteKey: string;
  public readonly dialogueSpriteKey?: string;
  public readonly isBoss: boolean;
  public readonly battleBgm: string;
  public readonly encounterBgm: string;
  public readonly victoryBgm: string;
  public readonly party: EnemyPokemon[];
  public readonly moneyMultiplier: number;
  public readonly gender: TrainerGender;

  constructor(trainerSlot: NonNullTrainerSlot, config: NewTrainerConfig) {
    this.trainerSlot = trainerSlot;
    this.gender = this.getGender(config);
    this.name = config.name[this.gender]!();
    this.title = config.title[this.gender]!();
    this.spriteKey = config.spriteKey[this.gender]!();
    this.dialogueSpriteKey = config.dialogueSpriteKey[this.gender]?.();
    this.isBoss = config.isBoss;
    this.battleBgm = config.battleBgm();
    this.encounterBgm = config.encounterBgm();
    this.victoryBgm = config.victoryBgm();
    this.party = this.getParty(config);
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
  private getGender(config: NewTrainerConfig): TrainerGender {
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
   * Generates the Trainer's party of {@linkcode EnemyPokemon} from the given config
   * and adds them to {@linkcode globalScene}.
   * @param config - The {@linkcode NewTrainerConfig} used to generate the Trainer.
   * This method only uses this config's {@linkcode partyConfigs} property.
   * @returns An array of {@linkcode EnemyPokemon} representing the Trainer's
   * party in slot order.
   * @see {@linkcode getPartyPokemonLevel}
   * @see {@linkcode getPartyPokemonSpecies}
   */
  private getParty({ partyConfigs }: NewTrainerConfig): EnemyPokemon[] {
    const party: EnemyPokemon[] = [];
    for (const config of partyConfigs) {
      const strength = coerceArray(config.strength);
      for (let i = 0; i < config.count; i++) {
        const level = getPartyPokemonLevel(strength[i] ?? strength.at(-1), globalScene.currentBattle.waveIndex);
        const species = getPokemonSpecies(getPartyPokemonSpecies(level, party, config));
        party.push(globalScene.addEnemyPokemon(species, level, config, config.postProcess));
      }
    }
    return party;
  }
}
