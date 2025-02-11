import { TurnHeldItemTransferModifier } from "#app/modifier/modifier";
import {
  Achv,
  ChallengeAchv,
  DamageAchv,
  HealAchv,
  LevelAchv,
  ModifierAchv,
  MoneyAchv,
  MonoGenAchv,
  MonoTypeAchv,
  RibbonAchv,
  achvs,
} from "#app/system/achv";
import { AchvTier } from "#enums/achv-tier";
import { NumberHolder } from "#app/utils";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { InverseBattleChallenge, SingleGenerationChallenge, SingleTypeChallenge } from "#app/data/challenge";
import { ElementalType } from "#enums/elemental-type";

describe("Achv", () => {
  let achv: Achv;

  beforeEach(() => {
    achv = new Achv("TestAchievement", "test_icon", 10);
  });

  it("should have the correct attributes", () => {
    expect(achv.name).toBe("TestAchievement.name");
    expect(achv.description).toBe("TestAchievement.description");
    expect(achv.iconImage).toBe("test_icon");
    expect(achv.score).toBe(10);
  });

  it("should set the achievement as secret", () => {
    achv.setSecret();
    expect(achv.secret).toBe(true);
    expect(achv.hasParent).toBe(false);

    achv.setSecret(true);
    expect(achv.secret).toBe(true);
    expect(achv.hasParent).toBe(true);
  });

  it("should return the correct tier based on the score", () => {
    const achv1 = new Achv("", "test_icon", 10);
    const achv2 = new Achv("", "test_icon", 25);
    const achv3 = new Achv("", "test_icon", 50);
    const achv4 = new Achv("", "test_icon", 75);
    const achv5 = new Achv("", "test_icon", 100);

    expect(achv1.getTier()).toBe(AchvTier.COMMON);
    expect(achv2.getTier()).toBe(AchvTier.GREAT);
    expect(achv3.getTier()).toBe(AchvTier.ULTRA);
    expect(achv4.getTier()).toBe(AchvTier.EPIC);
    expect(achv5.getTier()).toBe(AchvTier.MASTER);
  });

  it("should validate the achievement based on the condition function", () => {
    const conditionFunc = vi.fn((value: number) => value === 10);
    const achv = new Achv("", "test_icon", 10, conditionFunc);

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

  it("should create an instance of MoneyAchv", () => {
    const moneyAchv = new MoneyAchv("", 10000, "money_icon", 10);
    expect(moneyAchv).toBeInstanceOf(MoneyAchv);
    expect(moneyAchv instanceof Achv).toBe(true);
  });

  it("should validate the achievement based on the money amount", () => {
    const moneyAchv = new MoneyAchv("", 10000, "money_icon", 10);
    game.scene.money = 5000;

    expect(moneyAchv.validate()).toBe(false);

    game.scene.money = 15000;
    expect(moneyAchv.validate()).toBe(true);
  });
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
    const ribbonAchv = new RibbonAchv("", 10, "ribbon_icon", 10);
    expect(ribbonAchv).toBeInstanceOf(RibbonAchv);
    expect(ribbonAchv instanceof Achv).toBe(true);
  });

  it("should validate the achievement based on the ribbon amount", () => {
    const ribbonAchv = new RibbonAchv("", 10, "ribbon_icon", 10);
    game.scene.gameData.gameStats.ribbonsOwned = 5;

    expect(ribbonAchv.validate()).toBe(false);

    game.scene.gameData.gameStats.ribbonsOwned = 15;
    expect(ribbonAchv.validate()).toBe(true);
  });
});

describe("DamageAchv", () => {
  it("should create an instance of DamageAchv", () => {
    const damageAchv = new DamageAchv("", 250, "damage_icon", 10);
    expect(damageAchv).toBeInstanceOf(DamageAchv);
    expect(damageAchv instanceof Achv).toBe(true);
  });

  it("should validate the achievement based on the damage amount", () => {
    const damageAchv = new DamageAchv("", 250, "damage_icon", 10);
    const damageValue = new NumberHolder(200);

    expect(damageAchv.validate(damageValue)).toBe(false);

    damageValue.value = 300;
    expect(damageAchv.validate(damageValue)).toBe(true);
  });
});

describe("HealAchv", () => {
  it("should create an instance of HealAchv", () => {
    const healAchv = new HealAchv("", 250, "heal_icon", 10);
    expect(healAchv).toBeInstanceOf(HealAchv);
    expect(healAchv instanceof Achv).toBe(true);
  });

  it("should validate the achievement based on the heal amount", () => {
    const healAchv = new HealAchv("", 250, "heal_icon", 10);
    const healValue = new NumberHolder(200);

    expect(healAchv.validate(healValue)).toBe(false);

    healValue.value = 300;
    expect(healAchv.validate(healValue)).toBe(true);
  });
});

describe("LevelAchv", () => {
  it("should create an instance of LevelAchv", () => {
    const levelAchv = new LevelAchv("", 100, "level_icon", 10);
    expect(levelAchv).toBeInstanceOf(LevelAchv);
    expect(levelAchv instanceof Achv).toBe(true);
  });

  it("should validate the achievement based on the level", () => {
    const levelAchv = new LevelAchv("", 100, "level_icon", 10);
    const levelValue = new NumberHolder(50);

    expect(levelAchv.validate(levelValue)).toBe(false);

    levelValue.value = 150;
    expect(levelAchv.validate(levelValue)).toBe(true);
  });
});

describe("ModifierAchv", () => {
  it("should create an instance of ModifierAchv", () => {
    const modifierAchv = new ModifierAchv("", "modifier_icon", 10, () => true);
    expect(modifierAchv).toBeInstanceOf(ModifierAchv);
    expect(modifierAchv instanceof Achv).toBe(true);
  });

  it("should validate the achievement based on the modifier function", () => {
    const modifierAchv = new ModifierAchv("", "modifier_icon", 10, () => true);
    const modifier = new TurnHeldItemTransferModifier(null!, 3, 1);

    expect(modifierAchv.validate(modifier)).toBe(true);
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
    const monoGenAchv = new MonoGenAchv("SomeAchv", 3, "monotype_icon", 10);
    expect(monoGenAchv).toBeInstanceOf(MonoGenAchv);
    expect(monoGenAchv instanceof Achv).toBe(true);
    expect(monoGenAchv.name).toBe("SomeAchv.name");
    expect(monoGenAchv.description).toBe("SomeAchv.description");
  });

  it("should validate the achievement based on the challenge value and type", () => {
    const monoGenAchv = new MonoGenAchv("SomeAchv", 3, "monotype_icon", 10);
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
    const monoGenAchv = new MonoGenAchv("SomeAchv", 3, "monotype_icon", 10);
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
    const monoTypeAchv = new MonoTypeAchv(ElementalType.STELLAR, "monotype_icon", 10);
    expect(monoTypeAchv).toBeInstanceOf(MonoTypeAchv);
    expect(monoTypeAchv instanceof Achv).toBe(true);
    expect(monoTypeAchv.name).toBe("MONO_STELLAR.name");
    expect(monoTypeAchv.description).toBe("Complete the Stellar monotype challenge.");
  });

  it("should validate the achievement based on the challenge value and type", () => {
    const monoTypeAchv = new MonoTypeAchv(ElementalType.ROCK, "monotype_icon", 10);
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
    const monoTypeAchv = new MonoTypeAchv(ElementalType.ROCK, "monotype_icon", 10);
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
    expect(achvs._10K_MONEY).toBeInstanceOf(MoneyAchv);
    expect(achvs._100K_MONEY).toBeInstanceOf(MoneyAchv);
    expect(achvs._1M_MONEY).toBeInstanceOf(MoneyAchv);
    expect(achvs._10M_MONEY).toBeInstanceOf(MoneyAchv);
    expect(achvs._250_DMG).toBeInstanceOf(DamageAchv);
    expect(achvs._1000_DMG).toBeInstanceOf(DamageAchv);
    expect(achvs._2500_DMG).toBeInstanceOf(DamageAchv);
    expect(achvs._10000_DMG).toBeInstanceOf(DamageAchv);
    expect(achvs._250_HEAL).toBeInstanceOf(HealAchv);
    expect(achvs._1000_HEAL).toBeInstanceOf(HealAchv);
    expect(achvs._2500_HEAL).toBeInstanceOf(HealAchv);
    expect(achvs._10000_HEAL).toBeInstanceOf(HealAchv);
    expect(achvs.LV_100).toBeInstanceOf(LevelAchv);
    expect(achvs.LV_250).toBeInstanceOf(LevelAchv);
    expect(achvs.LV_1000).toBeInstanceOf(LevelAchv);
    expect(achvs._10_RIBBONS).toBeInstanceOf(RibbonAchv);
    expect(achvs._25_RIBBONS).toBeInstanceOf(RibbonAchv);
    expect(achvs._50_RIBBONS).toBeInstanceOf(RibbonAchv);
    expect(achvs._75_RIBBONS).toBeInstanceOf(RibbonAchv);
    expect(achvs._100_RIBBONS).toBeInstanceOf(RibbonAchv);
    expect(achvs.TRANSFER_MAX_STAT_STAGE).toBeInstanceOf(Achv);
    expect(achvs.MAX_FRIENDSHIP).toBeInstanceOf(Achv);
    expect(achvs.MEGA_EVOLVE).toBeInstanceOf(Achv);
    expect(achvs.GIGANTAMAX).toBeInstanceOf(Achv);
    expect(achvs.TERASTALLIZE).toBeInstanceOf(Achv);
    expect(achvs.STELLAR_TERASTALLIZE).toBeInstanceOf(Achv);
    expect(achvs.MINI_BLACK_HOLE).toBeInstanceOf(ModifierAchv);
    expect(achvs.CATCH_MYTHICAL).toBeInstanceOf(Achv);
    expect(achvs.CATCH_SUB_LEGENDARY).toBeInstanceOf(Achv);
    expect(achvs.CATCH_LEGENDARY).toBeInstanceOf(Achv);
    expect(achvs.SEE_SHINY).toBeInstanceOf(Achv);
    expect(achvs.SHINY_PARTY).toBeInstanceOf(Achv);
    expect(achvs.HATCH_MYTHICAL).toBeInstanceOf(Achv);
    expect(achvs.HATCH_SUB_LEGENDARY).toBeInstanceOf(Achv);
    expect(achvs.HATCH_LEGENDARY).toBeInstanceOf(Achv);
    expect(achvs.HATCH_SHINY).toBeInstanceOf(Achv);
    expect(achvs.HIDDEN_ABILITY).toBeInstanceOf(Achv);
    expect(achvs.PERFECT_IVS).toBeInstanceOf(Achv);
    expect(achvs.CLASSIC_VICTORY).toBeInstanceOf(Achv);
    expect(achvs.UNEVOLVED_CLASSIC_VICTORY).toBeInstanceOf(Achv);
    expect(achvs.FRESH_START).toBeInstanceOf(ChallengeAchv);
    expect(achvs.INVERSE_BATTLE).toBeInstanceOf(ChallengeAchv);
    expect(achvs.BREEDERS_IN_SPACE).toBeInstanceOf(Achv);
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

  it("should initialize the achievements with IDs and parent IDs", () => {
    expect(achvs._10K_MONEY.id).toBe("_10K_MONEY");
    expect(achvs._10K_MONEY.hasParent).toBe(undefined);
    expect(achvs._100K_MONEY.id).toBe("_100K_MONEY");
    expect(achvs._100K_MONEY.hasParent).toBe(true);
    expect(achvs._100K_MONEY.parentId).toBe("_10K_MONEY");
    expect(achvs._1M_MONEY.id).toBe("_1M_MONEY");
    expect(achvs._1M_MONEY.hasParent).toBe(true);
    expect(achvs._1M_MONEY.parentId).toBe("_100K_MONEY");
    expect(achvs._10M_MONEY.id).toBe("_10M_MONEY");
    expect(achvs._10M_MONEY.hasParent).toBe(true);
    expect(achvs._10M_MONEY.parentId).toBe("_1M_MONEY");
    expect(achvs.LV_100.id).toBe("LV_100");
    expect(achvs.LV_100.hasParent).toBe(false);
    expect(achvs.LV_250.id).toBe("LV_250");
    expect(achvs.LV_250.hasParent).toBe(true);
    expect(achvs.LV_250.parentId).toBe("LV_100");
    expect(achvs.LV_1000.id).toBe("LV_1000");
    expect(achvs.LV_1000.hasParent).toBe(true);
    expect(achvs.LV_1000.parentId).toBe("LV_250");
  });
});
