import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Sky Drop", () => {
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
    game.override
      .ability(AbilityId.BALL_FETCH)
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.SKY_DROP, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  describe("in Single Battles", () => {
    beforeEach(() => game.override.battleType("single"));

    it("should be preferred when the user is faster than the target", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);
      game.field.setSpeed(50, 100);

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toPreferSelectingMove(MoveId.SKY_DROP);
    });

    it("should be avoided when the user is slower than the target", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);
      game.field.setSpeed(100, 50);

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.SKY_DROP);
    });

    it("should be avoided when the opponent is Flying-type", async () => {
      await game.classicMode.startBattle(SpeciesId.WINGULL);
      game.field.setSpeed(50, 100);

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.SKY_DROP);
    });

    it("should be avoided when the opponent is too heavy", async () => {
      await game.classicMode.startBattle(SpeciesId.METAGROSS);
      game.field.setSpeed(50, 100);

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.SKY_DROP);
    });
  });

  describe("in Double Battles", async () => {
    beforeEach(() => game.override.battleType("double"));

    it("should be preferred when the user is faster than its opponents", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);
      game.field.setSpeed(50, 100);

      const [enemy] = game.scene.getEnemyField();
      expect(enemy).toPreferSelectingMove(MoveId.SKY_DROP);
    });

    it("should be avoided when the user is slower than its opponents", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);
      game.field.setSpeed(100, 50);

      const [enemy] = game.scene.getEnemyField();
      expect(enemy).toNeverSelectMove(MoveId.SKY_DROP);
    });

    it("should be avoided when the user has No Guard", async () => {
      game.override.enemyAbility(AbilityId.NO_GUARD);

      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);
      game.field.setSpeed(50, 100);

      const [enemy] = game.scene.getEnemyField();
      expect(enemy).toNeverSelectMove(MoveId.SKY_DROP);
    });

    it("should be avoided when both opponents have No Guard", async () => {
      game.override.ability(AbilityId.NO_GUARD);

      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);
      game.field.setSpeed(50, 100);

      const [enemy] = game.scene.getEnemyField();

      // TODO: Sky Drop should not count unrevealed opposing instances of No Guard when scored
      // expect(enemy).toPreferSelectingMove(MoveId.SKY_DROP);
      // game.field.revealAllAbilities();

      expect(enemy).toNeverSelectMove(MoveId.SKY_DROP);
    });

    it("should be avoided when both opponents have used Lock On on the user", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);
      game.field.setSpeed(50, 100);

      game.move.use(MoveId.LOCK_ON, 0, BattlerIndex.ENEMY);
      game.move.use(MoveId.LOCK_ON, 1, BattlerIndex.ENEMY);
      await game.move.selectEnemyMove(MoveId.SPLASH);
      await game.move.selectEnemyMove(MoveId.SPLASH);
      await game.toNextTurn();

      const [enemy] = game.scene.getEnemyField();
      expect(enemy).toNeverSelectMove(MoveId.SKY_DROP);
    });
  });
});
