import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { BattleStyle } from "#app/overrides";
import { WeatherType } from "#enums/weather-type";
import { allMoves } from "#app/data/data-lists";

describe("Moves - Screen Moves", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;
  const singleBattleMultiplier = 0.5;
  const doubleBattleMultiplier = 2732 / 4096;

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
    game.override
      .ability(Abilities.BALL_FETCH)
      .startingLevel(1000)
      .enemyAbility(Abilities.STALL) // So that player always outspeeds enemy's screen move on turn 1
      .enemyLevel(1000)
      .enemySpecies(Species.MAGIKARP);

    vi.spyOn(allMoves[MoveId.FROST_BREATH], "accuracy", "get").mockReturnValue(100);
  });

  /**
   * Helper function to test that a screen move applies a certain damage multiplier under certain conditions.
   */
  async function testDamageMultiplier(
    battleType: BattleStyle,
    attackMove: MoveId,
    multiplier: number,
    disableCrits: boolean = true,
  ): Promise<void> {
    if (disableCrits) {
      game.override.disableCrits();
    }
    game.override.battleType(battleType);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemyParty = game.scene.getEnemyParty();

    // Turn 1: Player outspeeds and attacks while the screen is not up
    game.move.use(attackMove);
    await game.toNextTurn();

    const oldDamages = enemyParty.map((p) => p.getInverseHp());
    enemyParty.forEach((p) => (p.hp = p.getMaxHp()));

    // Turn 2: Player attacks again while the screen is up
    game.move.use(attackMove);
    await game.toNextTurn();

    const newDamages = enemyParty.map((p) => p.getInverseHp());

    expect(oldDamages.length).toBe(newDamages.length);
    for (let i = 0; i < oldDamages.length; i++) {
      expect(newDamages[i]).toBeGreaterThan(oldDamages[i] * multiplier - 2);
      expect(newDamages[i]).toBeLessThan(oldDamages[i] * multiplier + 2);
    }
  }

  /**
   * Helper function to test that a screen move does not reduce confusion damage.
   */
  async function testConfusionDamage(): Promise<void> {
    game.override.battleType("single").disableCrits();

    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemy = game.field.getEnemyPokemon();

    // Turn 1: Enemy hits itself in confusion without screens up
    game.override.statusActivation(true);
    game.move.use(MoveId.CONFUSE_RAY);
    await game.toNextTurn();

    const oldDamage = enemy.getInverseHp();
    enemy.hp = enemy.getMaxHp();

    // Turn 2: Enemy sets up screens
    game.override.statusActivation(false);
    game.move.use(MoveId.CONFUSE_RAY);
    await game.toNextTurn();

    expect(enemy.isFullHp()).toBe(true);

    // Turn 3: Enemy hits itself in confusion with screens up
    game.override.statusActivation(true);
    game.move.use(MoveId.CONFUSE_RAY);
    await game.toNextTurn();

    const newDamage = enemy.getInverseHp();

    expect(enemy.isFullHp()).toBe(false);
    expect(oldDamage).toBe(newDamage);
  }

  describe("Moves - Reflect", () => {
    beforeEach(() => {
      game.override.enemyMoveset(MoveId.REFLECT);
    });

    it("should reduce damage of physical attacks by half in a single battle", async () => {
      await testDamageMultiplier("single", MoveId.EARTHQUAKE, singleBattleMultiplier);
    });

    it("should reduce damage of physical attacks by a third in a double battle", async () => {
      await testDamageMultiplier("double", MoveId.EARTHQUAKE, doubleBattleMultiplier);
    });

    it("should not affect special attacks", async () => {
      await testDamageMultiplier("single", MoveId.SURF, 1);
    });

    it("should not reduce damage of a critical hit", async () => {
      await testDamageMultiplier("single", MoveId.WICKED_BLOW, 1, false);
    });

    it("should not reduce damage of a fixed-damage move", async () => {
      await testDamageMultiplier("single", MoveId.SEISMIC_TOSS, 1);
    });

    it("should not reduce confusion damage", async () => {
      await testConfusionDamage();
    });
  });

  describe("Moves - Light Screen", () => {
    beforeEach(() => {
      game.override.enemyMoveset(MoveId.LIGHT_SCREEN);
    });

    it("should reduce damage of special attacks by half in a single battle", async () => {
      await testDamageMultiplier("single", MoveId.SURF, singleBattleMultiplier);
    });

    it("should reduce damage of special attacks by a third in a double battle", async () => {
      await testDamageMultiplier("double", MoveId.SURF, doubleBattleMultiplier);
    });

    it("should not affect physical attacks", async () => {
      await testDamageMultiplier("single", MoveId.EARTHQUAKE, 1);
    });

    it("should not reduce damage of a critical hit", async () => {
      await testDamageMultiplier("single", MoveId.FROST_BREATH, 1, false);
    });

    it("should not reduce damage of a fixed-damage move", async () => {
      await testDamageMultiplier("single", MoveId.NIGHT_SHADE, 1);
    });

    it("should not reduce confusion damage", async () => {
      await testConfusionDamage();
    });
  });

  describe("Moves - Aurora Veil", () => {
    beforeEach(() => {
      game.override.enemyMoveset(MoveId.AURORA_VEIL).weather(WeatherType.SNOW);
    });

    it("should reduce damage of physical attacks by half in a single battle", async () => {
      await testDamageMultiplier("single", MoveId.EARTHQUAKE, singleBattleMultiplier);
    });

    it("should reduce of physical attacks by a third in a double battle", async () => {
      await testDamageMultiplier("double", MoveId.EARTHQUAKE, doubleBattleMultiplier);
    });

    it("should reduce damage of special attacks by half in a single battle", async () => {
      await testDamageMultiplier("single", MoveId.SURF, singleBattleMultiplier);
    });

    it("should reduce damage of special attacks by a third in a double battle", async () => {
      await testDamageMultiplier("double", MoveId.SURF, doubleBattleMultiplier);
    });

    it("should not reduce damage of a critical hit", async () => {
      await testDamageMultiplier("single", MoveId.FLOWER_TRICK, 1, false);
    });

    it("should fail if the weather is not Hail or Snow", async () => {
      game.override.weather(WeatherType.RAIN);
      await testDamageMultiplier("single", MoveId.EARTHQUAKE, 1);
    });

    it("should fail if the weather is suppressed by Cloud Nine or Air Lock", async () => {
      game.override.ability(Abilities.CLOUD_NINE);
      await testDamageMultiplier("single", MoveId.EARTHQUAKE, 1);
    });

    it("should not reduce damage of a fixed-damage move", async () => {
      await testDamageMultiplier("single", MoveId.DRAGON_RAGE, 1);
    });

    it("should not reduce confusion damage", async () => {
      await testConfusionDamage();
    });
  });
});
