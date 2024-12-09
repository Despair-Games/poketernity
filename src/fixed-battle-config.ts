import type { BattleType } from "./enums/battle-type";
import type { EnemyPokemon } from "./field/pokemon";
import type Trainer from "./field/trainer";
import type { CustomModifierSettings } from "./modifier/modifier-type";

type GetTrainerFunc = () => Trainer;
type GetEnemyPartyFunc = () => EnemyPokemon[];

export class FixedBattleConfig {
  public battleType: BattleType;
  public double: boolean;
  public getTrainer: GetTrainerFunc;
  public getEnemyParty: GetEnemyPartyFunc;
  public seedOffsetWaveIndex: number;
  public customModifierRewardSettings?: CustomModifierSettings;

  setBattleType(battleType: BattleType): FixedBattleConfig {
    this.battleType = battleType;
    return this;
  }

  setDouble(double: boolean): FixedBattleConfig {
    this.double = double;
    return this;
  }

  setGetTrainerFunc(getTrainerFunc: GetTrainerFunc): FixedBattleConfig {
    this.getTrainer = getTrainerFunc;
    return this;
  }

  setGetEnemyPartyFunc(getEnemyPartyFunc: GetEnemyPartyFunc): FixedBattleConfig {
    this.getEnemyParty = getEnemyPartyFunc;
    return this;
  }

  setSeedOffsetWave(seedOffsetWaveIndex: number): FixedBattleConfig {
    this.seedOffsetWaveIndex = seedOffsetWaveIndex;
    return this;
  }

  setCustomModifierRewards(customModifierRewardSettings: CustomModifierSettings) {
    this.customModifierRewardSettings = customModifierRewardSettings;
    return this;
  }
}

export interface FixedBattleConfigs {
  [key: number]: FixedBattleConfig;
}
