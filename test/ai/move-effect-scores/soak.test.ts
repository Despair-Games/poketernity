import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Soak", () => {
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
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.SOAK, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  const setSpeed = (playerSpd: number, enemySpd: number) => {
    const players = game.scene.getPlayerField();
    const enemies = game.scene.getEnemyField();

    players.forEach((p) => p.setStat(Stat.SPD, playerSpd));
    enemies.forEach((p) => p.setStat(Stat.SPD, enemySpd));
  };

  describe("in Single Battles", () => {
    it("should be avoided when the user is Water-type", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGBY);
      setSpeed(50, 100);

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.SOAK);
    });

    it("should be preferred when the user is Grass-type", async () => {
      game.override.enemySpecies(SpeciesId.CHIKORITA);

      await game.classicMode.startBattle(SpeciesId.MAGBY);
      setSpeed(50, 100);

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toPreferSelectingMove(MoveId.SOAK);
    });

    it("should be preferred even if the user is slower than the opponent", async () => {
      game.override.enemySpecies(SpeciesId.CHIKORITA);

      await game.classicMode.startBattle(SpeciesId.MAGBY);
      setSpeed(100, 50);

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toPreferSelectingMove(MoveId.SOAK);
    });

    it("should be avoided when the opponent is already Water-type", async () => {
      game.override.enemySpecies(SpeciesId.CHIKORITA);

      await game.classicMode.startBattle(SpeciesId.MAGIKARP);
      setSpeed(50, 100);

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toNeverSelectMove(MoveId.SOAK);
    });
  });

  describe("in Double Battles", () => {
    beforeEach(() =>
      game.override //
        .battleType("double")
        .enemySpecies(SpeciesId.MELTAN),
    );

    it("should be preferred when an ally's type matchup would improve", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGBY, SpeciesId.SLUGMA);
      setSpeed(50, 100);

      const [enemy] = game.scene.getEnemyField();
      expect(enemy).toPreferSelectingMove(MoveId.SOAK);
    });

    it("should be avoided when an ally's type matchup would worsen", async () => {
      await game.classicMode.startBattle(SpeciesId.CHIKORITA, SpeciesId.PANSAGE);
      setSpeed(50, 100);

      const [enemy] = game.scene.getEnemyField();
      expect(enemy).toNeverSelectMove(MoveId.SOAK);
    });

    it("should not be preferred when the user is slower than its opponents", async () => {
      await game.classicMode.startBattle(SpeciesId.MAGBY, SpeciesId.SLUGMA);
      setSpeed(100, 50);

      const [enemy] = game.scene.getEnemyField();
      expect(enemy).not.toPreferSelectingMove(MoveId.SOAK);
    });
  });
});
