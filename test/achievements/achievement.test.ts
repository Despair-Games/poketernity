import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { InverseBattleChallenge, SingleGenerationChallenge, SingleTypeChallenge } from "#app/data/challenge";
import { ElementalType } from "#enums/elemental-type";
import {
  Achievement,
  ChallengeCompletionAchievement,
  ClassicCompletionAchievement,
  MonoGenAchievement,
  MonoTypeAchievement,
  newAchvs,
  RibbonAchievement,
} from "#app/system/achievements/achievements";
import { AchvCategory } from "#enums/achv-category";

describe("Achievements", () => {
  let achv: Achievement;

  beforeEach(() => {
    achv = new Achievement(
      "TestAchievement",
      "test_icon",
      vi.fn((value: number) => value === 10),
      AchvCategory.TEST,
    );
  });

  it("should have the correct attributes", () => {
    expect(achv.localizationInformation.nameKey).toBe("TestAchievement");
    expect(achv.localizationInformation.descriptionKey).toBe("TestAchievement");
    expect(achv.iconKey).toBe("test_icon");
  });

  it("should set the achievement as secret", () => {
    achv.setSecret();
    expect(achv.secret).toBe(true);
  });

  it("should validate the achievement based on the condition function", () => {
    expect(achv.conditionFunc(5)).toBe(false);
    expect(achv.conditionFunc(10)).toBe(true);
  });
});

describe("Ribbon Achievements", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
  });

  it("should create an instance of RibbonAchv", () => {
    const ribbonAchv = new RibbonAchievement("", "ribbon_icon", 10);
    expect(ribbonAchv).toBeInstanceOf(RibbonAchievement);
    expect(ribbonAchv instanceof Achievement).toBe(true);
  });

  it("should validate the achievement based on the ribbon amount", () => {
    const ribbonAchv = new RibbonAchievement("", "ribbon_icon", 10);
    game.scene.gameData.gameStats.ribbonsOwned = 5;

    expect(ribbonAchv.conditionFunc(game.scene.gameData.gameStats.ribbonsOwned)).toBe(false);

    game.scene.gameData.gameStats.ribbonsOwned = 15;
    expect(ribbonAchv.conditionFunc(game.scene.gameData.gameStats.ribbonsOwned)).toBe(true);
  });
});

describe("MonoGen Challenge Achievement", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.scene.gameMode.challenges = [];
  });

  it("should create an instance of MonoGenAchievement", () => {
    const monoGenAchievement = new MonoGenAchievement("sample", "sample", 3);
    expect(monoGenAchievement).toBeInstanceOf(MonoGenAchievement);
    expect(monoGenAchievement instanceof Achievement).toBe(true);
  });

  it("should validate the achievement based on the challenge value and type", () => {
    const monoGenAchievement = new MonoGenAchievement("sample", "sample", 3);
    const challenge = new SingleGenerationChallenge();
    challenge.value = 1;
    game.scene.gameMode.challenges.push(challenge);
    expect(monoGenAchievement.conditionFunc(game.scene.gameMode.challenges)).toBe(false);
    challenge.value = 3;
    expect(monoGenAchievement.conditionFunc(game.scene.gameMode.challenges)).toBe(true);

    game.scene.gameMode.challenges = [];
    const wrongChallenge = new SingleTypeChallenge();
    wrongChallenge.value = 3;
    game.scene.gameMode.challenges.push(wrongChallenge);
    expect(monoGenAchievement.conditionFunc(game.scene.gameMode.challenges)).toBe(false);
  });

  it("should not validate the achievement if inverse challenge is active", () => {
    const monoGenAchievement = new MonoGenAchievement("", "", 3);
    const challenge = new SingleGenerationChallenge();
    challenge.value = 3;
    game.scene.gameMode.challenges.push(challenge);
    const inverseChallenge = new InverseBattleChallenge();
    game.scene.gameMode.challenges.push(inverseChallenge);

    inverseChallenge.value = 0;
    expect(monoGenAchievement.conditionFunc(game.scene.gameMode.challenges)).toBe(true);
    inverseChallenge.value = 1;
    expect(monoGenAchievement.conditionFunc(game.scene.gameMode.challenges)).toBe(false);
  });
});

describe("MonoType Challenge Achievement", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  beforeAll(() => {
    phaserGame = new Phaser.Game({
      type: Phaser.HEADLESS,
    });
  });

  afterEach(() => {
    game.phaseInterceptor.restoreOg();
  });

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.scene.gameMode.challenges = [];
  });

  it("should create an instance of MonoTypeAchievement", () => {
    const monoTypeAchievement = new MonoTypeAchievement(ElementalType.STELLAR, "monotype_icon");
    expect(monoTypeAchievement).toBeInstanceOf(MonoTypeAchievement);
    expect(monoTypeAchievement instanceof Achievement).toBe(true);
  });

  it("should validate the achievement based on the challenge value and type", () => {
    const monoTypeAchievement = new MonoTypeAchievement(ElementalType.ROCK, "monotype_icon");
    const challenge = new SingleTypeChallenge();
    challenge.value = 1;
    game.scene.gameMode.challenges.push(challenge);
    expect(monoTypeAchievement.conditionFunc(game.scene.gameMode.challenges)).toBe(false);
    challenge.value = 6;
    expect(monoTypeAchievement.conditionFunc(game.scene.gameMode.challenges)).toBe(true);

    game.scene.gameMode.challenges = [];
    const wrongChallenge = new SingleGenerationChallenge();
    wrongChallenge.value = 6;
    game.scene.gameMode.challenges.push(wrongChallenge);
    expect(monoTypeAchievement.conditionFunc(game.scene.gameMode.challenges)).toBe(false);
  });

  it("should not validate the achievement if inverse challenge is active", () => {
    const monoTypeAchievement = new MonoTypeAchievement(ElementalType.ROCK, "monotype_icon");
    const challenge = new SingleTypeChallenge();
    challenge.value = 6;
    game.scene.gameMode.challenges.push(challenge);

    const inverseChallenge = new InverseBattleChallenge();
    game.scene.gameMode.challenges.push(inverseChallenge);

    inverseChallenge.value = 0;
    expect(monoTypeAchievement.conditionFunc(game.scene.gameMode.challenges)).toBe(true);
    inverseChallenge.value = 1;
    expect(monoTypeAchievement.conditionFunc(game.scene.gameMode.challenges)).toBe(false);
  });
});

describe("Achievements", () => {
  it("should contain the predefined achievements", () => {
    expect(newAchvs._10_RIBBONS).toBeInstanceOf(RibbonAchievement);
    expect(newAchvs._25_RIBBONS).toBeInstanceOf(RibbonAchievement);
    expect(newAchvs._50_RIBBONS).toBeInstanceOf(RibbonAchievement);
    expect(newAchvs._75_RIBBONS).toBeInstanceOf(RibbonAchievement);
    expect(newAchvs._100_RIBBONS).toBeInstanceOf(RibbonAchievement);
    expect(newAchvs.MAX_FRIENDSHIP).toBeInstanceOf(Achievement);
    expect(newAchvs.MEGA_EVOLVE).toBeInstanceOf(Achievement);
    expect(newAchvs.GIGANTAMAX).toBeInstanceOf(Achievement);
    expect(newAchvs.TERASTALLIZE).toBeInstanceOf(Achievement);
    expect(newAchvs.STELLAR_TERASTALLIZE).toBeInstanceOf(Achievement);
    expect(newAchvs.CATCH_MYTHICAL).toBeInstanceOf(Achievement);
    expect(newAchvs.CATCH_SUB_LEGENDARY).toBeInstanceOf(Achievement);
    expect(newAchvs.CATCH_LEGENDARY).toBeInstanceOf(Achievement);
    expect(newAchvs.SEE_SHINY).toBeInstanceOf(Achievement);
    expect(newAchvs.SHINY_PARTY).toBeInstanceOf(Achievement);
    expect(newAchvs.HIDDEN_ABILITY).toBeInstanceOf(Achievement);
    expect(newAchvs.PERFECT_IVS).toBeInstanceOf(Achievement);
    expect(newAchvs.CLASSIC_VICTORY).toBeInstanceOf(Achievement);
    expect(newAchvs.UNEVOLVED_CLASSIC_VICTORY).toBeInstanceOf(ClassicCompletionAchievement);
    expect(newAchvs.FRESH_START).toBeInstanceOf(ChallengeCompletionAchievement);
    expect(newAchvs.INVERSE_BATTLE).toBeInstanceOf(ChallengeCompletionAchievement);
    expect(newAchvs.MONO_GEN_ONE).toBeInstanceOf(MonoGenAchievement);
    expect(newAchvs.MONO_GEN_TWO).toBeInstanceOf(MonoGenAchievement);
    expect(newAchvs.MONO_GEN_THREE).toBeInstanceOf(MonoGenAchievement);
    expect(newAchvs.MONO_GEN_FOUR).toBeInstanceOf(MonoGenAchievement);
    expect(newAchvs.MONO_GEN_FIVE).toBeInstanceOf(MonoGenAchievement);
    expect(newAchvs.MONO_GEN_SIX).toBeInstanceOf(MonoGenAchievement);
    expect(newAchvs.MONO_GEN_SEVEN).toBeInstanceOf(MonoGenAchievement);
    expect(newAchvs.MONO_GEN_EIGHT).toBeInstanceOf(MonoGenAchievement);
    expect(newAchvs.MONO_GEN_NINE).toBeInstanceOf(MonoGenAchievement);
    expect(newAchvs.MONO_NORMAL).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_FIGHTING).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_FLYING).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_POISON).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_GROUND).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_ROCK).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_BUG).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_GHOST).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_STEEL).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_FIRE).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_WATER).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_GRASS).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_ELECTRIC).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_PSYCHIC).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_ICE).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_DRAGON).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_DARK).toBeInstanceOf(MonoTypeAchievement);
    expect(newAchvs.MONO_FAIRY).toBeInstanceOf(MonoTypeAchievement);
  });
});
