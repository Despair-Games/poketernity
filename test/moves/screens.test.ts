import { SCREEN_DOUBLES_DMG_FACTOR, SCREEN_SINGLES_DMG_FACTOR } from "#app/constants";
import type { BattleStyle } from "#app/overrides";
import { AbilityId } from "#enums/ability-id";
import { ArenaTagSide } from "#enums/arena-tag-side";
import { ArenaTagType } from "#enums/arena-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Screen Moves", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  interface TestOptions {
    disableCrits?: boolean;
    addAuroraVeil?: boolean;
  }

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
      .ability(AbilityId.NO_GUARD) // Frost Breath is not 100% accurate
      .startingLevel(1000)
      .enemyAbility(AbilityId.STALL) // So that player always outspeeds enemy's screen move on turn 1
      .enemyLevel(1000)
      .enemySpecies(SpeciesId.MAGIKARP);
  });

  /**
   * Helper function to test that a screen move applies a certain damage multiplier under certain conditions.
   *
   * @param options.disableCrits If `true`, apply the `disableCrits()` override. Default `true`.
   * @param options.addAuroraVeil If `true`, manually add an Aurora Veil tag in between Turn 1 and Turn 2. Default `false`.
   */
  async function testDamageMultiplier(
    battleType: BattleStyle,
    attackMove: MoveId,
    multiplier: number,
    options?: TestOptions,
  ): Promise<void> {
    if (options?.disableCrits ?? true) {
      game.override.disableCrits();
    }
    game.override.battleType(battleType);

    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const enemyParty = game.scene.getEnemyParty();

    // Turn 1: Player outspeeds and attacks while the screen is not up
    game.move.use(attackMove);
    await game.toNextTurn();

    const oldDamages = enemyParty.map((p) => p.getInverseHp());
    enemyParty.forEach((p) => (p.hp = p.getMaxHp()));

    // Turn 2: Player attacks again while the screen is up
    if (options?.addAuroraVeil) {
      game.scene.arena.addTag(ArenaTagType.AURORA_VEIL, enemyParty[0].id, 5, MoveId.AURORA_VEIL, ArenaTagSide.ENEMY);
    }
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

    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

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
      await testDamageMultiplier("single", MoveId.EARTHQUAKE, SCREEN_SINGLES_DMG_FACTOR);
    });

    it("should reduce damage of physical attacks by a third in a double battle", async () => {
      await testDamageMultiplier("double", MoveId.EARTHQUAKE, SCREEN_DOUBLES_DMG_FACTOR);
    });

    it("should not affect special attacks", async () => {
      await testDamageMultiplier("single", MoveId.SURF, 1);
    });

    it("should be able to coexist with Aurora Veil without stacking damage reduction", async () => {
      game.override.weather(WeatherType.SNOW);
      await testDamageMultiplier("single", MoveId.EARTHQUAKE, SCREEN_SINGLES_DMG_FACTOR, { addAuroraVeil: true });
    });

    it("should not reduce damage of a critical hit", async () => {
      await testDamageMultiplier("single", MoveId.WICKED_BLOW, 1, { disableCrits: false });
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
      await testDamageMultiplier("single", MoveId.SURF, SCREEN_SINGLES_DMG_FACTOR);
    });

    it("should reduce damage of special attacks by a third in a double battle", async () => {
      await testDamageMultiplier("double", MoveId.SURF, SCREEN_DOUBLES_DMG_FACTOR);
    });

    it("should not affect physical attacks", async () => {
      await testDamageMultiplier("single", MoveId.EARTHQUAKE, 1);
    });

    it("should be able to coexist with Aurora Veil without stacking damage reduction", async () => {
      game.override.weather(WeatherType.SNOW);
      await testDamageMultiplier("single", MoveId.SURF, SCREEN_SINGLES_DMG_FACTOR, { addAuroraVeil: true });
    });

    it("should not reduce damage of a critical hit", async () => {
      await testDamageMultiplier("single", MoveId.FROST_BREATH, 1, { disableCrits: false });
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
      await testDamageMultiplier("single", MoveId.EARTHQUAKE, SCREEN_SINGLES_DMG_FACTOR);
    });

    it("should reduce damage of physical attacks by a third in a double battle", async () => {
      await testDamageMultiplier("double", MoveId.EARTHQUAKE, SCREEN_DOUBLES_DMG_FACTOR);
    });

    it("should reduce damage of special attacks by half in a single battle", async () => {
      await testDamageMultiplier("single", MoveId.SURF, SCREEN_SINGLES_DMG_FACTOR);
    });

    it("should reduce damage of special attacks by a third in a double battle", async () => {
      await testDamageMultiplier("double", MoveId.SURF, SCREEN_DOUBLES_DMG_FACTOR);
    });

    it("should not reduce damage of a critical hit", async () => {
      await testDamageMultiplier("single", MoveId.FLOWER_TRICK, 1, { disableCrits: false });
    });

    it("should fail if the weather is not Hail or Snow", async () => {
      game.override.weather(WeatherType.RAIN);
      await testDamageMultiplier("single", MoveId.EARTHQUAKE, 1);
    });

    it("should fail if the weather is suppressed by Cloud Nine or Air Lock", async () => {
      game.override.ability(AbilityId.CLOUD_NINE);
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
