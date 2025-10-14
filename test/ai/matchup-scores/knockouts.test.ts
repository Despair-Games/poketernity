import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Matchup Scores) - Knockouts", () => {
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
      .battleType("single")
      .startingWave(8)
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPARK)
      .startingLevel(100)
      .enemyLevel(100)
      .enemyDisableSwitching(false);
  });

  describe("Safe opponent KOs - should never switch out", () => {
    it("enemy full HP; player 1 HP", async () => {
      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      const player = game.field.getPlayerPokemon();
      const enemy = game.field.getEnemyPokemon();
      player.hp = 1;

      expect(enemy).not.toPreferSwitching();
    });

    it("enemy 1 HP; player 1 HP; enemy outspeeds player", async () => {
      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      const player = game.field.getPlayerPokemon();
      const enemy = game.field.getEnemyPokemon();
      player.hp = 1;
      enemy.hp = 1;
      player.setStat(Stat.SPD, 50);
      enemy.setStat(Stat.SPD, 100);

      expect(enemy).not.toPreferSwitching();
    });

    it("enemy 1 HP; player 1 HP; enemy has a priority move", async () => {
      game.override.enemyMoveset(MoveId.QUICK_ATTACK);

      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      const player = game.field.getPlayerPokemon();
      const enemy = game.field.getEnemyPokemon();
      player.hp = 1;
      enemy.hp = 1;
      player.setStat(Stat.SPD, 100);
      enemy.setStat(Stat.SPD, 50);

      expect(enemy).not.toPreferSwitching();
    });

    it("enemy 1 HP; player 1 HP; player is known to have no attacks", async () => {
      game.override.moveset([MoveId.SPLASH, MoveId.CELEBRATE, MoveId.STOCKPILE, MoveId.SWALLOW]);

      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      const player = game.field.getPlayerPokemon();
      const enemy = game.field.getEnemyPokemon();
      player.hp = 1;
      enemy.hp = 1;
      game.field.revealAllMoves();

      expect(enemy).not.toPreferSwitching();
    });
  });

  describe("Avoidable ally KOs - should always switch out", async () => {
    it("active enemy 1 HP; inactive enemy full HP", async () => {
      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      const enemy = game.field.getEnemyPokemon();
      enemy.hp = 1;

      expect(enemy).toPreferSwitching();
    });

    it("active enemy 1 HP; player 1 HP; player outspeeds enemy", async () => {
      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      const player = game.field.getPlayerPokemon();
      const enemy = game.field.getEnemyPokemon();
      player.hp = 1;
      enemy.hp = 1;
      player.setStat(Stat.SPD, 100);
      enemy.setStat(Stat.SPD, 50);

      expect(enemy).toPreferSwitching();
    });
  });

  describe("Unavoidable ally KOs - should never switch out", async () => {
    it("all enemies 1 HP", async () => {
      await game.classicMode.startBattle(SpeciesId.FEEBAS);

      const enemy = game.field.getEnemyPokemon();
      enemy.getParty().forEach((p) => (p.hp = 1));

      expect(enemy).not.toPreferSwitching();
    });
  });
});
