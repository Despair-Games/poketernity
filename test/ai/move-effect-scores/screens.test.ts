import { allMoves } from "#data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Move Effect Scores - Screens", () => {
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
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  describe.each([
    { moveName: "Light Screen", moveId: MoveId.LIGHT_SCREEN },
    { moveName: "Reflect", moveId: MoveId.REFLECT },
    { moveName: "Aurora Veil", moveId: MoveId.AURORA_VEIL },
    { moveName: "Safeguard", moveId: MoveId.SAFEGUARD },
    { moveName: "Lucky Chant", moveId: MoveId.LUCKY_CHANT },
  ])("$moveName", ({ moveId }) => {
    beforeEach(() => {
      game.override.enemyMoveset([moveId, MoveId.TACKLE, MoveId.SPLASH]).weather(WeatherType.SNOW); // to ensure Aurora Veil doesn't fail
    });

    it("should be preferred on the first turn of battle", async () => {
      await game.classicMode.startBattle([SpeciesId.AGGRON]);

      const enemy = game.field.getEnemyPokemon();

      expect(enemy).toPreferSelectingMove(moveId);
    });

    it("should be avoided if the move's effect is already active", async () => {
      await game.classicMode.startBattle([SpeciesId.AGGRON]);

      const enemy = game.field.getEnemyPokemon();

      game.move.use(MoveId.SPLASH);
      await game.move.selectEnemyMove(moveId);
      await game.toNextTurn();

      expect(enemy).toNeverSelectMove(moveId);
    });
  });

  describe.each([
    { moveName: "Glitzy Glow", moveId: MoveId.GLITZY_GLOW, cmpId: MoveId.EXPANDING_FORCE },
    { moveName: "Baddy Bad", moveId: MoveId.BADDY_BAD, cmpId: MoveId.DARK_PULSE },
  ])("$moveName", ({ moveId, cmpId }) => {
    beforeEach(() => vi.spyOn(allMoves.get(moveId), "accuracy", "get").mockReturnValue(-1));

    it("should be preferred over a similar move with a lesser additional effect", async () => {
      game.override.enemyMoveset([moveId, cmpId]);

      await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

      const enemy = game.field.getEnemyPokemon();

      expect(enemy).toPreferSelectingMove(moveId);
    });

    it("should still be preferred over Tackle if its secondary effect is already active", async () => {
      game.override.enemyMoveset([moveId, MoveId.TACKLE]);

      await game.classicMode.startBattle([SpeciesId.BLISSEY]);

      const enemy = game.field.getEnemyPokemon();

      game.move.use(MoveId.SPLASH);
      await game.move.selectEnemyMove(moveId);
      await game.toNextTurn();

      expect(enemy).toPreferSelectingMove(moveId);
    });
  });
});
