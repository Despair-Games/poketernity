import { allMoves } from "#app/data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { revealAllMoves } from "#test/ai/utils/enemy-command-utils";
import { GameManager } from "#test/test-utils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Move Effect Scores - Conditional Protection", () => {
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
      .battleType("double")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  describe.each([
    { moveName: "Wide Guard", moveId: MoveId.WIDE_GUARD, blockedMove: MoveId.EARTHQUAKE },
    { moveName: "Quick Guard", moveId: MoveId.QUICK_GUARD, blockedMove: MoveId.EXTREME_SPEED },
    { moveName: "Mat Block", moveId: MoveId.MAT_BLOCK, blockedMove: MoveId.ENERGY_BALL },
  ])("$moveName", ({ moveId, blockedMove }) => {
    beforeEach(() => {
      game.override.enemyMoveset([moveId, MoveId.SPLASH, MoveId.TACKLE]);
      vi.spyOn(allMoves.get(blockedMove), "power", "get").mockReturnValue(1000);
    });

    it("should not be preferred in single battles", async () => {
      game.override.battleType("single").moveset(blockedMove);

      await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

      revealAllMoves(game.scene);
      const enemy = game.field.getEnemyPokemon();
      expect(enemy).not.toPreferSelectingMove(moveId);
    });

    it("should be preferred in double battles when player Pokemon have a relevant and threatening move", async () => {
      game.override.moveset(blockedMove);

      await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

      revealAllMoves(game.scene);
      const [enemy] = game.scene.getEnemyField();
      expect(enemy).toPreferSelectingMove(moveId);
    });

    it("should not be preferred when the player doesn't have any relevant moves", async () => {
      game.override.moveset(MoveId.SPLASH);

      await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

      revealAllMoves(game.scene);
      const [enemy] = game.scene.getEnemyField();
      expect(enemy).not.toPreferSelectingMove(moveId);
    });

    it("should not be preferred when the player's relevant moves aren't revealed", async () => {
      game.override.moveset(blockedMove);

      await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

      const [enemy] = game.scene.getEnemyField();
      expect(enemy).not.toPreferSelectingMove(moveId);
    });
  });

  describe("Crafty Shield", () => {
    it("should not be preferred in single battles", async () => {
      game.override.battleType("single").enemyMoveset([MoveId.CRAFTY_SHIELD, MoveId.TACKLE]);

      await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).not.toPreferSelectingMove(MoveId.CRAFTY_SHIELD);
    });

    it("should be preferred over doing nothing in double battles", async () => {
      game.override.enemyMoveset([MoveId.CRAFTY_SHIELD, MoveId.SPLASH]);

      await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

      const [enemy] = game.scene.getEnemyField();
      expect(enemy).toPreferSelectingMove(MoveId.CRAFTY_SHIELD);
    });
  });
});
