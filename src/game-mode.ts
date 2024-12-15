import i18next from "i18next";
import type { FixedBattleConfigs } from "./battle";
import { classicFixedBattles, FixedBattleConfig } from "./battle";
import type { Challenge } from "./data/challenge";
import { allChallenges, applyChallenges, ChallengeType, copyChallenge } from "./data/challenge";
import type PokemonSpecies from "./data/pokemon-species";
import { allSpecies } from "./data/pokemon-species";
import type { Arena } from "./field/arena";
import Overrides from "#app/overrides";
import { randSeedInt, randSeedItem } from "#app/utils";
import { Biome } from "#enums/biome";
import { Species } from "#enums/species";
import { Challenges } from "./enums/challenges";
import { globalScene } from "#app/global-scene";

export enum GameModes {
  CLASSIC,
  ENDLESS,
  SPLICED_ENDLESS,
  DAILY,
  CHALLENGE,
}

interface GameModeConfig {
  isClassic?: boolean;
  isEndless?: boolean;
  isDaily?: boolean;
  hasTrainers?: boolean;
  hasNoShop?: boolean;
  hasShortBiomes?: boolean;
  hasRandomBiomes?: boolean;
  hasRandomBosses?: boolean;
  isSplicedOnly?: boolean;
  isChallenge?: boolean;
  hasMysteryEncounters?: boolean;
}

// Describes min and max waves for MEs in specific game modes
export const CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES: [number, number] = [10, 180];
export const CHALLENGE_MODE_MYSTERY_ENCOUNTER_WAVES: [number, number] = [10, 180];

export class GameMode implements GameModeConfig {
  public modeId: GameModes;
  public isClassic: boolean;
  public isEndless: boolean;
  public isDaily: boolean;
  public hasTrainers: boolean;
  public hasNoShop: boolean;
  public hasShortBiomes: boolean;
  public hasRandomBiomes: boolean;
  public hasRandomBosses: boolean;
  public isSplicedOnly: boolean;
  public isChallenge: boolean;
  public challenges: Challenge[];
  public battleConfig: FixedBattleConfigs;
  public hasMysteryEncounters: boolean;
  public minMysteryEncounterWave: number;
  public maxMysteryEncounterWave: number;

  constructor(modeId: GameModes, config: GameModeConfig, battleConfig?: FixedBattleConfigs) {
    this.modeId = modeId;
    this.challenges = [];
    Object.assign(this, config);
    if (this.isChallenge) {
      this.challenges = allChallenges.map((c) => copyChallenge(c));
    }
    this.battleConfig = battleConfig || {};
  }

  /**
   * Helper function to see if a GameMode has a specific challenge type
   * @param challenge the Challenges it looks for
   * @returns true if the game mode has that challenge
   */
  hasChallenge(challenge: Challenges): boolean {
    return this.challenges.some((c) => c.id === challenge && c.value !== 0);
  }

  /**
   * Helper function to see if the game mode is using fresh start
   * @returns true if a fresh start challenge is being applied
   */
  isFreshStartChallenge(): boolean {
    return this.hasChallenge(Challenges.FRESH_START);
  }

  /**
   * @returns either:
   * - override from overrides.ts
   * - 20 for Daily Runs
   * - 5 for all other modes
   */
  getStartingLevel(): number {
    if (Overrides.STARTING_LEVEL_OVERRIDE) {
      return Overrides.STARTING_LEVEL_OVERRIDE;
    }
    switch (this.modeId) {
      case GameModes.DAILY:
        return 20;
      default:
        return 5;
    }
  }

  /**
   * @returns either:
   * - override from overrides.ts
   * - 1000
   */
  getStartingMoney(): number {
    return Overrides.STARTING_MONEY_OVERRIDE || 1000;
  }

  /**
   * @param scene current BattleScene
   * @returns either:
   * - random biome for Daily mode
   * - override from overrides.ts
   * - Town
   */
  getStartingBiome(): Biome {
    switch (this.modeId) {
      case GameModes.DAILY:
        return globalScene.generateRandomBiome(this.getWaveForDifficulty(1));
      default:
        return Overrides.STARTING_BIOME_OVERRIDE || Biome.TOWN;
    }
  }

  getWaveForDifficulty(waveIndex: number, ignoreCurveChanges: boolean = false): number {
    switch (this.modeId) {
      case GameModes.DAILY:
        return waveIndex + 30 + (!ignoreCurveChanges ? Math.floor(waveIndex / 5) : 0);
      default:
        return waveIndex;
    }
  }

  /**
   * Determines whether or not to generate a trainer
   * @param waveIndex the current floor the player is on (trainer sprites fail to generate on X1 floors)
   * @param arena the arena that contains the scene and functions
   * @returns true if a trainer should be generated, false otherwise
   */
  isWaveTrainer(waveIndex: number, arena: Arena): boolean {
    /**
     * Daily spawns trainers on floors 5, 15, 20, 25, 30, 35, 40, and 45
     */
    if (this.isDaily) {
      return waveIndex % 10 === 5 || (!(waveIndex % 10) && waveIndex > 10 && !this.isWaveFinal(waveIndex));
    }
    if (waveIndex % 30 === (globalScene.offsetGym ? 0 : 20) && !this.isWaveFinal(waveIndex)) {
      return true;
    } else if (waveIndex % 10 !== 1 && waveIndex % 10) {
      /**
       * Do not check X1 floors since there's a bug that stops trainer sprites from appearing
       * after a X0 full party heal
       */

      const trainerChance = arena.getTrainerChance();
      let allowTrainerBattle = true;
      if (trainerChance) {
        const waveBase = Math.floor(waveIndex / 10) * 10;
        // Stop generic trainers from spawning in within 3 waves of a trainer battle
        for (let w = Math.max(waveIndex - 3, waveBase + 2); w <= Math.min(waveIndex + 3, waveBase + 9); w++) {
          if (w === waveIndex) {
            continue;
          }
          if (w % 30 === (globalScene.offsetGym ? 0 : 20) || this.isFixedBattle(w)) {
            allowTrainerBattle = false;
            break;
          } else if (w < waveIndex) {
            globalScene.executeWithSeedOffset(() => {
              const waveTrainerChance = arena.getTrainerChance();
              if (!randSeedInt(waveTrainerChance)) {
                allowTrainerBattle = false;
              }
            }, w);
            if (!allowTrainerBattle) {
              break;
            }
          }
        }
      }
      return Boolean(allowTrainerBattle && trainerChance && !randSeedInt(trainerChance));
    }
    return false;
  }

  isTrainerBoss(waveIndex: number, biomeType: Biome, offsetGym: boolean): boolean {
    switch (this.modeId) {
      case GameModes.DAILY:
        return waveIndex > 10 && waveIndex < 50 && !(waveIndex % 10);
      default:
        return (
          waveIndex % 30 === (offsetGym ? 0 : 20)
          && (biomeType !== Biome.END || this.isClassic || this.isWaveFinal(waveIndex))
        );
    }
  }

  getOverrideSpecies(waveIndex: number): PokemonSpecies | null {
    if (this.isDaily && this.isWaveFinal(waveIndex)) {
      const allFinalBossSpecies = allSpecies.filter(
        (s) =>
          s.isLegendLike() && s.baseTotal >= 600 && s.speciesId !== Species.ETERNATUS && s.speciesId !== Species.ARCEUS,
      );
      return randSeedItem(allFinalBossSpecies);
    }

    return null;
  }

  /**
   * Checks if wave provided is the final for current or specified game mode
   * @param waveIndex
   * @param modeId game mode
   * @returns if the current wave is final for classic or daily OR a minor boss in endless
   */
  isWaveFinal(waveIndex: number, modeId: GameModes = this.modeId): boolean {
    switch (modeId) {
      case GameModes.CLASSIC:
      case GameModes.CHALLENGE:
        return waveIndex === 200;
      case GameModes.ENDLESS:
      case GameModes.SPLICED_ENDLESS:
        return !(waveIndex % 250);
      case GameModes.DAILY:
        return waveIndex === 50;
    }
  }

  /**
   * Every 10 waves is a boss battle
   * @returns true if waveIndex is a multiple of 10
   */
  isBoss(waveIndex: number): boolean {
    return waveIndex % 10 === 0;
  }

  /**
   * @returns `true` if the current battle is against classic mode's final boss
   */
  isBattleClassicFinalBoss(waveIndex: number): boolean {
    return (this.modeId === GameModes.CLASSIC || this.modeId === GameModes.CHALLENGE) && this.isWaveFinal(waveIndex);
  }

  /**
   * Every 50 waves of an Endless mode is a boss
   * At this time it is paradox pokemon
   * @returns true if waveIndex is a multiple of 50 in Endless
   */
  isEndlessBoss(waveIndex: number): boolean {
    return waveIndex % 50 === 0 && (this.modeId === GameModes.ENDLESS || this.modeId === GameModes.SPLICED_ENDLESS);
  }

  /**
   * Every 250 waves of an Endless mode is a minor boss
   * At this time it is Eternatus
   * @returns true if waveIndex is a multiple of 250 in Endless
   */
  isEndlessMinorBoss(waveIndex: number): boolean {
    return waveIndex % 250 === 0 && (this.modeId === GameModes.ENDLESS || this.modeId === GameModes.SPLICED_ENDLESS);
  }

  /**
   * Every 1000 waves of an Endless mode is a major boss
   * At this time it is Eternamax Eternatus
   * @returns true if waveIndex is a multiple of 1000 in Endless
   */
  isEndlessMajorBoss(waveIndex: number): boolean {
    return waveIndex % 1000 === 0 && (this.modeId === GameModes.ENDLESS || this.modeId === GameModes.SPLICED_ENDLESS);
  }

  /**
   * Checks whether there is a fixed battle on this gamemode on a given wave.
   * @param waveIndex The wave to check.
   * @returns If this game mode has a fixed battle on this wave
   */
  isFixedBattle(waveIndex: number): boolean {
    const dummyConfig = new FixedBattleConfig();
    return (
      this.battleConfig.hasOwnProperty(waveIndex)
      || applyChallenges(this, ChallengeType.FIXED_BATTLES, waveIndex, dummyConfig)
    );
  }

  /**
   * Returns the config for the fixed battle for a particular wave.
   * @param waveIndex The wave to check.
   * @returns The {@linkcode FixedBattleConfig} for this wave.
   */
  getFixedBattle(waveIndex: number): FixedBattleConfig {
    const challengeConfig = new FixedBattleConfig();
    if (applyChallenges(this, ChallengeType.FIXED_BATTLES, waveIndex, challengeConfig)) {
      return challengeConfig;
    } else {
      return this.battleConfig[waveIndex];
    }
  }

  getClearScoreBonus(): number {
    switch (this.modeId) {
      case GameModes.CLASSIC:
      case GameModes.CHALLENGE:
        return 5000;
      case GameModes.DAILY:
        return 2500;
      default:
        return 0;
    }
  }

  getEnemyModifierChance(isBoss: boolean): number {
    switch (this.modeId) {
      case GameModes.CLASSIC:
      case GameModes.CHALLENGE:
      case GameModes.DAILY:
        return !isBoss ? 18 : 6;
      case GameModes.ENDLESS:
      case GameModes.SPLICED_ENDLESS:
        return !isBoss ? 12 : 4;
    }
  }

  getName(): string {
    switch (this.modeId) {
      case GameModes.CLASSIC:
        return i18next.t("gameMode:classic");
      case GameModes.ENDLESS:
        return i18next.t("gameMode:endless");
      case GameModes.SPLICED_ENDLESS:
        return i18next.t("gameMode:endlessSpliced");
      case GameModes.DAILY:
        return i18next.t("gameMode:dailyRun");
      case GameModes.CHALLENGE:
        return i18next.t("gameMode:challenge");
    }
  }

  /**
   * Returns the wave range where MEs can spawn for the game mode [min, max]
   */
  getMysteryEncounterLegalWaves(): [number, number] {
    switch (this.modeId) {
      default:
        return [0, 0];
      case GameModes.CLASSIC:
        return CLASSIC_MODE_MYSTERY_ENCOUNTER_WAVES;
      case GameModes.CHALLENGE:
        return CHALLENGE_MODE_MYSTERY_ENCOUNTER_WAVES;
    }
  }

  static getModeName(modeId: GameModes): string {
    switch (modeId) {
      case GameModes.CLASSIC:
        return i18next.t("gameMode:classic");
      case GameModes.ENDLESS:
        return i18next.t("gameMode:endless");
      case GameModes.SPLICED_ENDLESS:
        return i18next.t("gameMode:endlessSpliced");
      case GameModes.DAILY:
        return i18next.t("gameMode:dailyRun");
      case GameModes.CHALLENGE:
        return i18next.t("gameMode:challenge");
    }
  }
}

export function getGameMode(gameMode: GameModes): GameMode {
  switch (gameMode) {
    case GameModes.CLASSIC:
      return new GameMode(
        GameModes.CLASSIC,
        { isClassic: true, hasTrainers: true, hasMysteryEncounters: true },
        classicFixedBattles,
      );
    case GameModes.ENDLESS:
      return new GameMode(GameModes.ENDLESS, { isEndless: true, hasShortBiomes: true, hasRandomBosses: true });
    case GameModes.SPLICED_ENDLESS:
      return new GameMode(GameModes.SPLICED_ENDLESS, {
        isEndless: true,
        hasShortBiomes: true,
        hasRandomBosses: true,
        isSplicedOnly: true,
      });
    case GameModes.DAILY:
      return new GameMode(GameModes.DAILY, { isDaily: true, hasTrainers: true, hasNoShop: true });
    case GameModes.CHALLENGE:
      return new GameMode(
        GameModes.CHALLENGE,
        { isClassic: true, hasTrainers: true, isChallenge: true, hasMysteryEncounters: true },
        classicFixedBattles,
      );
  }
}
