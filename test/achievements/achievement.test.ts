import { Achievement, ChallengeAchv, MonoGenAchv, MonoTypeAchv, RibbonAchv, achvs } from "#app/system/achievements";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { InverseBattleChallenge, SingleGenerationChallenge, SingleTypeChallenge } from "#app/data/challenge";
import { ElementalType } from "#enums/elemental-type";

describe("Achv", () => {
  let achv: Achievement;

  beforeEach(() => {
    achv = new Achievement("TestAchievement", "test_icon");
  });

  it("should have the correct attributes", () => {
    expect(achv.name).toBe("TestAchievement.name");
    expect(achv.description).toBe("TestAchievement.description");
    expect(achv.iconImage).toBe("test_icon");
  });

  it("should set the achievement as secret", () => {
    achv.setSecret();
    expect(achv.secret).toBe(true);
    expect(achv.hasParent).toBe(false);

    achv.setSecret(true);
    expect(achv.secret).toBe(true);
    expect(achv.hasParent).toBe(true);
  });

  it("should validate the achievement based on the condition function", () => {
    const conditionFunc = vi.fn((value: number) => value === 10);
    const achv = new Achievement("", "test_icon", conditionFunc);

    expect(achv.validate(5)).toBe(false);
    expect(achv.validate(10)).toBe(true);
    expect(conditionFunc).toHaveBeenCalledTimes(2);
  });
});

describe("MoneyAchv", () => {
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

  describe("RibbonAchv", () => {
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
      const ribbonAchv = new RibbonAchv("", 10, "ribbon_icon");
      expect(ribbonAchv).toBeInstanceOf(RibbonAchv);
      expect(ribbonAchv instanceof Achievement).toBe(true);
    });

    it("should validate the achievement based on the ribbon amount", () => {
      const ribbonAchv = new RibbonAchv("", 10, "ribbon_icon");
      game.scene.gameData.gameStats.ribbonsOwned = 5;

      expect(ribbonAchv.validate()).toBe(false);

      game.scene.gameData.gameStats.ribbonsOwned = 15;
      expect(ribbonAchv.validate()).toBe(true);
    });
  });

  describe("MonoGenAchv", () => {
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

    it("should create an instance of MonoGenAchv", () => {
      const monoGenAchv = new MonoGenAchv("SomeAchv", 3, "monotype_icon");
      expect(monoGenAchv).toBeInstanceOf(MonoGenAchv);
      expect(monoGenAchv instanceof Achievement).toBe(true);
      expect(monoGenAchv.name).toBe("SomeAchv.name");
      expect(monoGenAchv.description).toBe("SomeAchv.description");
    });

    it("should validate the achievement based on the challenge value and type", () => {
      const monoGenAchv = new MonoGenAchv("SomeAchv", 3, "monotype_icon");
      const challenge = new SingleGenerationChallenge();
      challenge.value = 1;
      expect(monoGenAchv.validate(challenge)).toBe(false);
      challenge.value = 3;
      expect(monoGenAchv.validate(challenge)).toBe(true);
      const wrongChallenge = new SingleTypeChallenge();
      wrongChallenge.value = 3;
      expect(monoGenAchv.validate(wrongChallenge)).toBe(false);
    });

    it("should not validate the achievement if inverse challenge is active", () => {
      const monoGenAchv = new MonoGenAchv("SomeAchv", 3, "monotype_icon");
      const challenge = new SingleGenerationChallenge();
      challenge.value = 3;
      const inverseChallenge = new InverseBattleChallenge();
      game.scene.gameMode.challenges.push(inverseChallenge);

      inverseChallenge.value = 0;
      expect(monoGenAchv.validate(challenge)).toBe(true);
      inverseChallenge.value = 1;
      expect(monoGenAchv.validate(challenge)).toBe(false);
    });
  });

  describe("MonoTypeAchv", () => {
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

    it("should create an instance of MonoTypeAchv", () => {
      const monoTypeAchv = new MonoTypeAchv(ElementalType.STELLAR, "monotype_icon");
      expect(monoTypeAchv).toBeInstanceOf(MonoTypeAchv);
      expect(monoTypeAchv instanceof Achievement).toBe(true);
      expect(monoTypeAchv.name).toBe("MONO_STELLAR.name");
      expect(monoTypeAchv.description).toBe("Complete the Stellar monotype challenge.");
    });

    it("should validate the achievement based on the challenge value and type", () => {
      const monoTypeAchv = new MonoTypeAchv(ElementalType.ROCK, "monotype_icon");
      const challenge = new SingleTypeChallenge();
      challenge.value = 1;
      expect(monoTypeAchv.validate(challenge)).toBe(false);
      challenge.value = 6;
      expect(monoTypeAchv.validate(challenge)).toBe(true);

      const wrongChallenge = new SingleGenerationChallenge();
      wrongChallenge.value = 6;
      expect(monoTypeAchv.validate(wrongChallenge)).toBe(false);
    });

    it("should not validate the achievement if inverse challenge is active", () => {
      const monoTypeAchv = new MonoTypeAchv(ElementalType.ROCK, "monotype_icon");
      const challenge = new SingleTypeChallenge();
      challenge.value = 6;
      const inverseChallenge = new InverseBattleChallenge();
      game.scene.gameMode.challenges.push(inverseChallenge);

      inverseChallenge.value = 0;
      expect(monoTypeAchv.validate(challenge)).toBe(true);
      inverseChallenge.value = 1;
      expect(monoTypeAchv.validate(challenge)).toBe(false);
    });
  });

  describe("achvs", () => {
    it("should contain the predefined achievements", () => {
      expect(achvs._10_RIBBONS).toBeInstanceOf(RibbonAchv);
      expect(achvs._25_RIBBONS).toBeInstanceOf(RibbonAchv);
      expect(achvs._50_RIBBONS).toBeInstanceOf(RibbonAchv);
      expect(achvs._75_RIBBONS).toBeInstanceOf(RibbonAchv);
      expect(achvs._100_RIBBONS).toBeInstanceOf(RibbonAchv);
      expect(achvs.MAX_FRIENDSHIP).toBeInstanceOf(Achievement);
      expect(achvs.MEGA_EVOLVE).toBeInstanceOf(Achievement);
      expect(achvs.GIGANTAMAX).toBeInstanceOf(Achievement);
      expect(achvs.TERASTALLIZE).toBeInstanceOf(Achievement);
      expect(achvs.STELLAR_TERASTALLIZE).toBeInstanceOf(Achievement);
      expect(achvs.CATCH_MYTHICAL).toBeInstanceOf(Achievement);
      expect(achvs.CATCH_SUB_LEGENDARY).toBeInstanceOf(Achievement);
      expect(achvs.CATCH_LEGENDARY).toBeInstanceOf(Achievement);
      expect(achvs.SEE_SHINY).toBeInstanceOf(Achievement);
      expect(achvs.SHINY_PARTY).toBeInstanceOf(Achievement);
      expect(achvs.HIDDEN_ABILITY).toBeInstanceOf(Achievement);
      expect(achvs.PERFECT_IVS).toBeInstanceOf(Achievement);
      expect(achvs.CLASSIC_VICTORY).toBeInstanceOf(Achievement);
      expect(achvs.UNEVOLVED_CLASSIC_VICTORY).toBeInstanceOf(Achievement);
      expect(achvs.FRESH_START).toBeInstanceOf(ChallengeAchv);
      expect(achvs.INVERSE_BATTLE).toBeInstanceOf(ChallengeAchv);
      expect(achvs.MONO_GEN_ONE_VICTORY).toBeInstanceOf(MonoGenAchv);
      expect(achvs.MONO_GEN_TWO_VICTORY).toBeInstanceOf(MonoGenAchv);
      expect(achvs.MONO_GEN_THREE_VICTORY).toBeInstanceOf(MonoGenAchv);
      expect(achvs.MONO_GEN_FOUR_VICTORY).toBeInstanceOf(MonoGenAchv);
      expect(achvs.MONO_GEN_FIVE_VICTORY).toBeInstanceOf(MonoGenAchv);
      expect(achvs.MONO_GEN_SIX_VICTORY).toBeInstanceOf(MonoGenAchv);
      expect(achvs.MONO_GEN_SEVEN_VICTORY).toBeInstanceOf(MonoGenAchv);
      expect(achvs.MONO_GEN_EIGHT_VICTORY).toBeInstanceOf(MonoGenAchv);
      expect(achvs.MONO_GEN_NINE_VICTORY).toBeInstanceOf(MonoGenAchv);
      expect(achvs.MONO_NORMAL).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_FIGHTING).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_FLYING).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_POISON).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_GROUND).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_ROCK).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_BUG).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_GHOST).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_STEEL).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_FIRE).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_WATER).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_GRASS).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_ELECTRIC).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_PSYCHIC).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_ICE).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_DRAGON).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_DARK).toBeInstanceOf(MonoTypeAchv);
      expect(achvs.MONO_FAIRY).toBeInstanceOf(MonoTypeAchv);
    });
  });
});
