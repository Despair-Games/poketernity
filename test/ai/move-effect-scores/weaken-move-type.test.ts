import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Weaken Move Type", () => {
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
    { moveName: "Water Sport", moveId: MoveId.WATER_SPORT, weakenedSpecies: SpeciesId.SLUGMA },
    { moveName: "Mud Sport", moveId: MoveId.MUD_SPORT, weakenedSpecies: SpeciesId.PICHU },
  ])("$moveName", ({ moveId, weakenedSpecies }) => {
    beforeEach(() => game.override.enemyMoveset([moveId, MoveId.SPLASH]));

    it("should be preferred for selection when only opponents are of the weakened type", async () => {
      await game.classicMode.startBattle(weakenedSpecies);

      const enemy = game.field.getEnemyPokemon();

      expect(enemy).toPreferSelectingMove(moveId);
    });

    it("should be avoided when only allies are of the weakened type", async () => {
      game.override.enemySpecies(weakenedSpecies);
      await game.classicMode.startBattle(SpeciesId.MAGIKARP);

      const enemy = game.field.getEnemyPokemon();

      expect(enemy).toNeverSelectMove(moveId);
    });

    it("should be avoided when all Pokemon are of the weakened type", async () => {
      game.override.enemySpecies(weakenedSpecies);
      await game.classicMode.startBattle(weakenedSpecies);

      const enemy = game.field.getEnemyPokemon();

      expect(enemy).toNeverSelectMove(moveId);
    });

    it("should be avoided when its effect is already active", async () => {
      await game.classicMode.startBattle(weakenedSpecies);

      const enemy = game.field.getEnemyPokemon();

      game.move.use(MoveId.SPLASH);
      await game.move.selectEnemyMove(moveId);
      await game.toNextTurn();

      expect(enemy).toNeverSelectMove(moveId);
    });
  });
});
