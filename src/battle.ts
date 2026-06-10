import type { GameMode } from "#app/game-mode";
import { globalScene } from "#app/global-scene";
import i18next from "#app/plugins/i18n";
import { TurnCommandManager } from "#app/turn-command-manager";
import {
  CHAMPION_TRAINER_POOL,
  ELITE_FOUR_1_TRAINER_POOL,
  ELITE_FOUR_2_TRAINER_POOL,
  ELITE_FOUR_3_TRAINER_POOL,
  ELITE_FOUR_4_TRAINER_POOL,
  EVIL_TEAM_ADMIN_TRAINER_POOL,
  EVIL_TEAM_BOSS_1_TRAINER_POOL,
  EVIL_TEAM_BOSS_2_TRAINER_POOL,
  EVIL_TEAM_GRUNT_TRAINER_POOL,
} from "#constants/trainer-constants";
import {
  CHAMPION_WAVE,
  ELITE_FOUR_1_WAVE,
  ELITE_FOUR_2_WAVE,
  ELITE_FOUR_3_WAVE,
  ELITE_FOUR_4_WAVE,
  EVIL_ADMIN_1_WAVE,
  EVIL_ADMIN_2_WAVE,
  EVIL_BOSS_1_WAVE,
  EVIL_BOSS_2_WAVE,
  EVIL_GRUNT_1_WAVE,
  EVIL_GRUNT_2_WAVE,
  EVIL_GRUNT_3_WAVE,
  EVIL_GRUNT_4_WAVE,
  RIVAL_WAVE,
  RIVAL2_WAVE,
  RIVAL3_WAVE,
  RIVAL4_WAVE,
  RIVAL5_WAVE,
  RIVAL6_WAVE,
  TUTORIAL_BATTLE_WAVE,
} from "#constants/wave-constants";
import { getLevelForWaveFunc } from "#data/exp";
import { ArenaTagType } from "#enums/arena-tag-type";
import { BattleType } from "#enums/battle-type";
import { ModifierTier } from "#enums/modifier-tier";
import { MysteryEncounterMode } from "#enums/mystery-encounter-mode";
import type { MysteryEncounterType } from "#enums/mystery-encounter-type";
import { PlayerGender } from "#enums/player-gender";
import type { PokeballType } from "#enums/pokeball-type";
import { SpeciesFormKey } from "#enums/species-form-key";
import { SpeciesId } from "#enums/species-id";
import { TrainerGender } from "#enums/trainer-gender";
import { TrainerType } from "#enums/trainer-type";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { PlayerPokemon } from "#field/player-pokemon";
import type { Pokemon } from "#field/pokemon";
import { MoneyMultiplierModifier, type PokemonHeldItemModifier } from "#modifier/modifier";
import type { CustomModifierSettings } from "#modifier/modifier-type";
import type { Move } from "#moves/move";
import type { MysteryEncounter } from "#mystery-encounters/mystery-encounter";
import { settings } from "#system/settings-manager";
import { allTrainerConfigs } from "#trainers/trainer-configs/all-trainer-configs";
import { TrainerDataSet } from "#trainers/trainer-data";
import { isBetween, NumberHolder } from "#utils/common-utils";
import { randomString, randSeedInt, randSeedItem } from "#utils/random-utils";
import { shiftCharCodes } from "#utils/string-utils";

interface FaintLogEntry {
  pokemon: Pokemon;
  turn: number;
}

/**
 * Uses the global RNG seed to generate a second seed to be used for in-battle RNG rolls.
 */
function generateBattleSeed() {
  return randomString(16, true);
}

export class Battle {
  protected gameMode: GameMode;
  public waveIndex: number;
  public battleType: BattleType;
  public trainerData?: TrainerDataSet;
  public enemyParty: EnemyPokemon[] = [];
  public seenEnemyPartyMemberIds: Set<number> = new Set<number>();
  public double: boolean;
  public started: boolean = false;
  public enemySwitchCounter: number = 0;
  public turn: number = 0;
  public turnManager: TurnCommandManager;
  public playerParticipantIds: Set<number> = new Set<number>();
  public battleScore: number = 0;
  public postBattleLoot: PokemonHeldItemModifier[] = [];
  public escapeAttempts: number = 0;
  public lastMove: Move;
  public battleSeed: string = generateBattleSeed();
  private battleSeedState: string | null = null;
  public moneyScattered: number = 0;
  public lastUsedPokeball: PokeballType | null = null;
  /** The number of times a Pokemon on the player's side has fainted this battle */
  public playerFaints: number = 0;
  /** The number of times a Pokemon on the enemy's side has fainted this battle */
  public enemyFaints: number = 0;
  public playerFaintsHistory: FaintLogEntry[] = [];
  public enemyFaintsHistory: FaintLogEntry[] = [];

  public mysteryEncounterType?: MysteryEncounterType;
  /** If the current battle is a Mystery Encounter, this will always be defined */
  public mysteryEncounter?: MysteryEncounter;

  private rngCounter: number = 0;

  constructor(
    gameMode: GameMode,
    waveIndex: number,
    battleType: BattleType,
    trainerData?: TrainerDataSet,
    double: boolean = false,
  ) {
    this.gameMode = gameMode;
    this.waveIndex = waveIndex;
    this.battleType = battleType;
    this.trainerData = trainerData;
    this.double = double;
    this.turnManager = new TurnCommandManager();
  }

  public get isClassicFinalBoss(): boolean {
    return this.gameMode.isClassic && this.gameMode.isWaveFinal(this.waveIndex);
  }

  /**
   * Function to get the level of wild Pokemon for a given wave
   *
   * This is the function to get the level for a wave:
   * - The `waveIndex` is adjusted by {@linkcode getWaveForDifficulty} for daily mode
   * - The base level uses {@linkcode getLevelForWaveFunc} (`1 + x/2 + x^2/625`)
   * - If the Pokemon is a boss, there is a `1.2` modifier
   * - If the boss is the final boss of classic mode, this level is rounded up
   * to the next multiple of 25
   * - If it's not the final wave then bosses can also have a +/- level fluctuation
   * of one tenth the adjusted waveIndex
   *
   * @returns the level
   */
  public getLevelForWave(): number {
    const levelWaveIndex = this.gameMode.getWaveForDifficulty(this.waveIndex);
    const baseLevel = getLevelForWaveFunc(levelWaveIndex);
    const bossMultiplier = 1.2;

    if (this.gameMode.isBoss(this.waveIndex)) {
      const ret = Math.floor(baseLevel * bossMultiplier);
      if (this.isClassicFinalBoss) {
        return Math.ceil(ret / 25) * 25;
      }
      let levelOffset = 0;
      if (!this.gameMode.isWaveFinal(this.waveIndex)) {
        levelOffset = Math.round(Phaser.Math.RND.realInRange(-1, 1) * Math.floor(levelWaveIndex / 10));
      }
      return ret + levelOffset;
    }

    /**
     * TODO: Simplify this. Also look into smaller deviations if total level is intended to be lower
     * for the same number of waves
     *
     * Absolute value is not needed since the value is always >= 0
     *
     * Deviation is a uniform deviation equal ranging from 0 to one tenth the levelWaveIndex
     */
    let levelOffset = 0;

    const deviation = 10 / levelWaveIndex;
    levelOffset = Math.abs(this.randSeedUniformForLevel(deviation));

    return Math.max(Math.round(baseLevel + levelOffset), 1);
  }

  /**
   * TODO: Remove this and use a simpler way to generate deviation
   *
   * Helper function for determining the deviation to add onto a wild Pokemon's level
   * @param value - The adjusted level wave index
   * @returns the deviation equal to `Phaser.Math.RND.realInRange(0, 1) * value / 10`
   */
  randSeedUniformForLevel(value: number): number {
    let rand = 0;
    for (let i = value; i > 0; i--) {
      rand += Phaser.Math.RND.realInRange(0, 1);
    }
    return rand / value;
  }

  getBattlerCount(): number {
    return this.double ? 2 : 1;
  }

  incrementTurn(): void {
    this.turn++;
    this.turnManager = new TurnCommandManager();
    this.battleSeedState = null;
  }

  addParticipant(playerPokemon: PlayerPokemon): void {
    this.playerParticipantIds.add(playerPokemon.id);
  }

  removeFaintedParticipant(playerPokemon: PlayerPokemon): void {
    this.playerParticipantIds.delete(playerPokemon.id);
  }

  addPostBattleLoot(enemyPokemon: EnemyPokemon): void {
    this.postBattleLoot.push(
      ...globalScene
        .findModifiers(
          (m) => m.isPokemonHeldItemModifier() && m.pokemonId === enemyPokemon.id && m.isTransferable,
          false,
        )
        .map((i) => {
          const ret = i as PokemonHeldItemModifier;
          // TODO: Figure out how to remove the `!`
          ret.pokemonId = null!;
          return ret;
        }),
    );
  }

  pickUpScatteredMoney(): void {
    const moneyAmount = new NumberHolder(globalScene.currentBattle.moneyScattered);
    globalScene.applyModifiers(MoneyMultiplierModifier, true, moneyAmount);

    if (globalScene.arena.hasTag(ArenaTagType.HAPPY_HOUR)) {
      moneyAmount.value *= 2;
    }

    globalScene.addMoney(moneyAmount.value);

    const userLocale = navigator.language || "en-US";
    const formattedMoneyAmount = moneyAmount.value.toLocaleString(userLocale);
    const message = i18next.t("battle:moneyPickedUp", { moneyAmount: formattedMoneyAmount });
    globalScene.phaseManager.createAndUnshiftPhase("MessagePhase", message, undefined, true);

    globalScene.currentBattle.moneyScattered = 0;
  }

  addBattleScore(): void {
    let partyMemberTurnMultiplier = globalScene.getEnemyParty().length / 2 + 0.5;
    if (this.double) {
      partyMemberTurnMultiplier /= 1.5;
    }
    for (const p of globalScene.getEnemyParty()) {
      if (p.boss) {
        partyMemberTurnMultiplier *= p.bossSegments / 1.5 / globalScene.getEnemyParty().length;
      }
    }
    const turnMultiplier = Phaser.Tweens.Builders.GetEaseFunction("Sine.easeIn")(
      1 - Math.min(this.turn - 2, 10 * partyMemberTurnMultiplier) / (10 * partyMemberTurnMultiplier),
    );
    const finalBattleScore = Math.ceil(this.battleScore * turnMultiplier);
    globalScene.score += finalBattleScore;
    console.log(
      `Battle Score: ${finalBattleScore} (${this.turn - 1} Turns x${Math.floor(turnMultiplier * 100) / 100})`,
    );
    console.log(`Total Score: ${globalScene.score}`);
    globalScene.updateScoreText();
  }

  getBgmOverride(): string | null {
    if (this.isBattleMysteryEncounter() && this.mysteryEncounter?.encounterMode === MysteryEncounterMode.DEFAULT) {
      // Music is overridden for MEs during ME onInit()
      // Should not use any BGM overrides before swapping from DEFAULT mode
      return null;
    }
    if (this.battleType === BattleType.TRAINER) {
      if (this.trainerData == null) {
        return null;
      }

      if (!this.started && this.trainerData.encounterBgm) {
        return this.trainerData.encounterBgm;
      }
      return this.trainerData.battleBgm;
    }

    if (this.gameMode.isClassic && isBetween(this.waveIndex, 195, 199)) {
      return "end_summit";
    }
    const wildOpponents = globalScene.getEnemyParty();
    for (const pokemon of wildOpponents) {
      if (this.isClassicFinalBoss) {
        if (pokemon.species.getFormSpriteKey(pokemon.formIndex) === SpeciesFormKey.ETERNAMAX) {
          return "battle_final";
        }
        return "battle_final_encounter";
      }
      if (pokemon.species.isLegendLike()) {
        switch (pokemon.species.speciesId) {
          case SpeciesId.ARTICUNO:
          case SpeciesId.ZAPDOS:
          case SpeciesId.MOLTRES:
          case SpeciesId.MEWTWO:
          case SpeciesId.MEW:
            return "battle_legendary_kanto";
          case SpeciesId.RAIKOU:
            return "battle_legendary_raikou";
          case SpeciesId.ENTEI:
            return "battle_legendary_entei";
          case SpeciesId.SUICUNE:
            return "battle_legendary_suicune";
          case SpeciesId.LUGIA:
            return "battle_legendary_lugia";
          case SpeciesId.HO_OH:
            return "battle_legendary_ho_oh";
          case SpeciesId.REGIROCK:
          case SpeciesId.REGICE:
          case SpeciesId.REGISTEEL:
          case SpeciesId.REGIGIGAS:
          case SpeciesId.REGIDRAGO:
          case SpeciesId.REGIELEKI:
            return "battle_legendary_regis_g6";
          case SpeciesId.GROUDON:
          case SpeciesId.KYOGRE:
            return "battle_legendary_gro_kyo";
          case SpeciesId.RAYQUAZA:
            return "battle_legendary_rayquaza";
          case SpeciesId.DEOXYS:
            return "battle_legendary_deoxys";
          case SpeciesId.UXIE:
          case SpeciesId.MESPRIT:
          case SpeciesId.AZELF:
            return "battle_legendary_lake_trio";
          case SpeciesId.HEATRAN:
          case SpeciesId.CRESSELIA:
          case SpeciesId.DARKRAI:
          case SpeciesId.SHAYMIN:
            return "battle_legendary_sinnoh";
          case SpeciesId.DIALGA:
          case SpeciesId.PALKIA:
            if (pokemon.species.getFormSpriteKey(pokemon.formIndex) === SpeciesFormKey.ORIGIN) {
              return "battle_legendary_origin_forme";
            }
            return "battle_legendary_dia_pal";
          case SpeciesId.GIRATINA:
            return "battle_legendary_giratina";
          case SpeciesId.ARCEUS:
            return "battle_legendary_arceus";
          case SpeciesId.COBALION:
          case SpeciesId.TERRAKION:
          case SpeciesId.VIRIZION:
          case SpeciesId.KELDEO:
          case SpeciesId.TORNADUS:
          case SpeciesId.LANDORUS:
          case SpeciesId.THUNDURUS:
          case SpeciesId.MELOETTA:
          case SpeciesId.GENESECT:
            return "battle_legendary_unova";
          case SpeciesId.KYUREM:
            return "battle_legendary_kyurem";
          case SpeciesId.XERNEAS:
          case SpeciesId.YVELTAL:
          case SpeciesId.ZYGARDE:
            return "battle_legendary_xern_yvel";
          case SpeciesId.TAPU_KOKO:
          case SpeciesId.TAPU_LELE:
          case SpeciesId.TAPU_BULU:
          case SpeciesId.TAPU_FINI:
            return "battle_legendary_tapu";
          case SpeciesId.SOLGALEO:
          case SpeciesId.LUNALA:
            return "battle_legendary_sol_lun";
          case SpeciesId.NECROZMA:
            switch (pokemon.getFormKey()) {
              case "dusk-mane":
              case "dawn-wings":
                return "battle_legendary_dusk_dawn";
              case "ultra":
                return "battle_legendary_ultra_nec";
              default:
                return "battle_legendary_sol_lun";
            }
          case SpeciesId.NIHILEGO:
          case SpeciesId.PHEROMOSA:
          case SpeciesId.BUZZWOLE:
          case SpeciesId.XURKITREE:
          case SpeciesId.CELESTEELA:
          case SpeciesId.KARTANA:
          case SpeciesId.GUZZLORD:
          case SpeciesId.POIPOLE:
          case SpeciesId.NAGANADEL:
          case SpeciesId.STAKATAKA:
          case SpeciesId.BLACEPHALON:
            return "battle_legendary_ub";
          case SpeciesId.ZACIAN:
          case SpeciesId.ZAMAZENTA:
            return "battle_legendary_zac_zam";
          case SpeciesId.GLASTRIER:
          case SpeciesId.SPECTRIER:
            return "battle_legendary_glas_spec";
          case SpeciesId.CALYREX:
            if (pokemon.getFormKey() === "ice" || pokemon.getFormKey() === "shadow") {
              return "battle_legendary_riders";
            }
            return "battle_legendary_calyrex";
          case SpeciesId.GALAR_ARTICUNO:
          case SpeciesId.GALAR_ZAPDOS:
          case SpeciesId.GALAR_MOLTRES:
            return "battle_legendary_birds_galar";
          case SpeciesId.WO_CHIEN:
          case SpeciesId.CHIEN_PAO:
          case SpeciesId.TING_LU:
          case SpeciesId.CHI_YU:
            return "battle_legendary_ruinous";
          case SpeciesId.KORAIDON:
          case SpeciesId.MIRAIDON:
            return "battle_legendary_kor_mir";
          case SpeciesId.OKIDOGI:
          case SpeciesId.MUNKIDORI:
          case SpeciesId.FEZANDIPITI:
            return "battle_legendary_loyal_three";
          case SpeciesId.OGERPON:
            return "battle_legendary_ogerpon";
          case SpeciesId.TERAPAGOS:
            return "battle_legendary_terapagos";
          case SpeciesId.PECHARUNT:
            return "battle_legendary_pecharunt";
          default:
            if (pokemon.species.isLegendary()) {
              return "battle_legendary_res_zek";
            }
            return "battle_legendary_unova";
        }
      }
    }

    if (globalScene.gameMode.isClassic && this.waveIndex <= 4) {
      return "battle_wild";
    }

    return null;
  }

  /**
   * Generates a random number using the current battle's seed. Calls {@linkcode randSeedInt}
   * @param range How large of a range of random numbers to choose from. If {@linkcode range} <= 1, returns {@linkcode min}
   * @param min The minimum integer to pick, default `0`
   * @returns A random integer between {@linkcode min} and ({@linkcode min} + {@linkcode range} - 1)
   */
  randSeedInt(range: number, min: number = 0): number {
    if (range <= 1) {
      return min;
    }
    const tempRngCounter = globalScene.rngCounter;
    const tempSeedOverride = globalScene.rngSeedOverride;
    const state = Phaser.Math.RND.state();
    if (this.battleSeedState) {
      Phaser.Math.RND.state(this.battleSeedState);
    } else {
      Phaser.Math.RND.sow([shiftCharCodes(this.battleSeed, this.turn << 6)]);
      console.log("Battle Seed:", this.battleSeed);
    }
    globalScene.rngCounter = this.rngCounter++;
    globalScene.rngSeedOverride = this.battleSeed;
    const ret = randSeedInt(range, min);
    this.battleSeedState = Phaser.Math.RND.state();
    Phaser.Math.RND.state(state);
    globalScene.rngCounter = tempRngCounter;
    globalScene.rngSeedOverride = tempSeedOverride;
    return ret;
  }

  /**
   * Returns if the battle is of type {@linkcode BattleType.MYSTERY_ENCOUNTER}
   */
  isBattleMysteryEncounter(): boolean {
    return this.battleType === BattleType.MYSTERY_ENCOUNTER;
  }

  /**
   * @param includeMEs - Whether to count Mystery Encounter trainer battles
   * @returns `true` if the current battle is a trainer battle
   */
  public isTrainerBattle(includeMEs: boolean = false): boolean {
    const { battleType, mysteryEncounter } = this;
    const trainerME = includeMEs ? mysteryEncounter?.encounterMode === MysteryEncounterMode.TRAINER_BATTLE : false;
    return battleType === BattleType.TRAINER || trainerME;
  }
}

export interface FixedBattleConfig {
  battleType: BattleType;
  getTrainerData?: () => TrainerDataSet;
  seedOffsetWaveIndex?: number;
  customModifierRewardSettings?: CustomModifierSettings;
}

class FixedBattleConfigBuilder {
  private readonly config: FixedBattleConfig = { battleType: BattleType.TRAINER };

  private validate(): boolean {
    if (this.config.battleType === BattleType.TRAINER && this.config.getTrainerData == null) {
      console.error("TRAINER battle detected without a defined method for getTrainerData!");
      return false;
    }

    return true;
  }

  public build(): FixedBattleConfig {
    if (!this.validate()) {
      throw new Error(`fixed-battle-config-builder: Required fields missing in generated config: ${this.config}`);
    }
    return this.config;
  }

  public withBattleType(battleType: BattleType): this {
    this.config.battleType = battleType;
    return this;
  }

  public withTrainer(trainerType: TrainerType): this {
    this.config.getTrainerData = () => TrainerDataSet.fromConfig(allTrainerConfigs[trainerType]!);
    return this;
  }

  public withRival(rivalType: TrainerType): this {
    this.config.getTrainerData = () =>
      TrainerDataSet.fromConfig(
        allTrainerConfigs[rivalType]!,
        settings.display.playerGender === PlayerGender.MALE ? TrainerGender.FEMALE : TrainerGender.MALE,
      );
    return this;
  }

  public withTrainerFromPool(...params: Parameters<typeof getRandomTrainerDataFunc>): this {
    this.config.getTrainerData = getRandomTrainerDataFunc(...params);
    return this;
  }

  public withSeedOffsetWave(waveIndex: number): this {
    this.config.seedOffsetWaveIndex = waveIndex;
    return this;
  }

  public withModifierRewards(customModifierRewardSettings: CustomModifierSettings): this {
    this.config.customModifierRewardSettings = customModifierRewardSettings;
    return this;
  }
}

/**
 * Helper function to generate a random trainer for evil team trainers and the elite 4/champion
 * @param trainerPool - The TrainerType or list of TrainerTypes that can possibly be generated
 * @param seedOffset - The seed offset to use for the random generation of the trainer
 * @returns the generated {@linkcode TrainerDataSet}
 */
function getRandomTrainerDataFunc(
  trainerPool: readonly (TrainerType | readonly TrainerType[])[],
  seedOffset: number = 0,
): () => TrainerDataSet {
  return () => {
    const trainerTypes: TrainerType[] = [];

    globalScene.executeWithSeedOffset(() => {
      for (const trainerPoolEntry of trainerPool) {
        const trainerType = Array.isArray(trainerPoolEntry) ? randSeedItem(trainerPoolEntry) : trainerPoolEntry;
        trainerTypes.push(trainerType);
      }
    }, seedOffset);

    return TrainerDataSet.fromConfig(allTrainerConfigs[randSeedItem(trainerTypes)]!);

    // TODO: Add 1/3 chance of double battle for Evil Team grunts
  };
}

export type FixedBattleConfigs = Record<number, FixedBattleConfig>;

export const classicFixedBattles: FixedBattleConfigs = {
  [TUTORIAL_BATTLE_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainer(TrainerType.YOUNGSTER)
    .build(),
  [RIVAL_WAVE]: new FixedBattleConfigBuilder() //
    .withRival(TrainerType.RIVAL)
    .build(),
  [RIVAL2_WAVE]: new FixedBattleConfigBuilder() //
    .withRival(TrainerType.RIVAL_2)
    .build(),
  [EVIL_GRUNT_1_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(EVIL_TEAM_GRUNT_TRAINER_POOL)
    .build(),
  [RIVAL3_WAVE]: new FixedBattleConfigBuilder() //
    .withRival(TrainerType.RIVAL_3)
    .build(),
  [EVIL_GRUNT_2_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(EVIL_TEAM_GRUNT_TRAINER_POOL)
    .withSeedOffsetWave(EVIL_GRUNT_1_WAVE)
    .build(),
  [EVIL_GRUNT_3_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(EVIL_TEAM_GRUNT_TRAINER_POOL)
    .withSeedOffsetWave(EVIL_GRUNT_1_WAVE)
    .build(),
  [EVIL_ADMIN_1_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(EVIL_TEAM_ADMIN_TRAINER_POOL)
    .withSeedOffsetWave(EVIL_GRUNT_1_WAVE)
    .build(),
  [RIVAL4_WAVE]: new FixedBattleConfigBuilder() //
    .withRival(TrainerType.RIVAL_4)
    .withModifierRewards({
      guaranteedModifierTiers: [ModifierTier.ULTRA, ModifierTier.ULTRA, ModifierTier.ULTRA, ModifierTier.ULTRA],
      allowLuckUpgrades: false,
    })
    .build(),
  [EVIL_GRUNT_4_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(EVIL_TEAM_GRUNT_TRAINER_POOL)
    .withSeedOffsetWave(EVIL_GRUNT_1_WAVE)
    .build(),
  [EVIL_ADMIN_2_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(EVIL_TEAM_ADMIN_TRAINER_POOL, 1)
    .withSeedOffsetWave(EVIL_GRUNT_1_WAVE)
    .build(),
  [EVIL_BOSS_1_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(EVIL_TEAM_BOSS_1_TRAINER_POOL)
    .withSeedOffsetWave(EVIL_GRUNT_1_WAVE)
    .withModifierRewards({
      guaranteedModifierTiers: [ModifierTier.ULTRA, ModifierTier.ULTRA, ModifierTier.GREAT, ModifierTier.GREAT],
      allowLuckUpgrades: false,
    })
    .build(),
  [RIVAL5_WAVE]: new FixedBattleConfigBuilder() //
    .withRival(TrainerType.RIVAL_5)
    .withModifierRewards({
      guaranteedModifierTiers: [
        ModifierTier.EPIC,
        ModifierTier.EPIC,
        ModifierTier.EPIC,
        ModifierTier.ULTRA,
        ModifierTier.ULTRA,
      ],
      allowLuckUpgrades: false,
    })
    .build(),
  [EVIL_BOSS_2_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(EVIL_TEAM_BOSS_2_TRAINER_POOL)
    .withSeedOffsetWave(EVIL_GRUNT_1_WAVE)
    .withModifierRewards({
      guaranteedModifierTiers: [
        ModifierTier.EPIC,
        ModifierTier.EPIC,
        ModifierTier.ULTRA,
        ModifierTier.ULTRA,
        ModifierTier.ULTRA,
        ModifierTier.ULTRA,
      ],
      allowLuckUpgrades: false,
    })
    .build(),
  [ELITE_FOUR_1_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(ELITE_FOUR_1_TRAINER_POOL)
    .build(),
  [ELITE_FOUR_2_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(ELITE_FOUR_2_TRAINER_POOL)
    .withSeedOffsetWave(ELITE_FOUR_1_WAVE)
    .build(),
  [ELITE_FOUR_3_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(ELITE_FOUR_3_TRAINER_POOL)
    .withSeedOffsetWave(ELITE_FOUR_1_WAVE)
    .build(),
  [ELITE_FOUR_4_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(ELITE_FOUR_4_TRAINER_POOL)
    .withSeedOffsetWave(ELITE_FOUR_1_WAVE)
    .build(),
  [CHAMPION_WAVE]: new FixedBattleConfigBuilder() //
    .withTrainerFromPool(CHAMPION_TRAINER_POOL)
    .withSeedOffsetWave(ELITE_FOUR_1_WAVE)
    .build(),
  [RIVAL6_WAVE]: new FixedBattleConfigBuilder() //
    .withRival(TrainerType.RIVAL_6)
    .withModifierRewards({
      guaranteedModifierTiers: [
        ModifierTier.EPIC,
        ModifierTier.EPIC,
        ModifierTier.ULTRA,
        ModifierTier.ULTRA,
        ModifierTier.GREAT,
        ModifierTier.GREAT,
      ],
      allowLuckUpgrades: false,
    })
    .build(),
};
