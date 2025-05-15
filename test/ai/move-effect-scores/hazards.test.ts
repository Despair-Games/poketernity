import { HAZARD_STATUS_MOVES } from "#constants/move-constants";
import { capitalizeString } from "#utils/string-utils";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Hazards", () => {
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

  describe.each(
    HAZARD_STATUS_MOVES.map((moveId) => ({
      moveName: capitalizeString(MoveId[moveId], "_", false, true),
      moveId,
    })),
  )("$moveName", ({ moveId }) => {
    const baseMoveset = [moveId, MoveId.SPLASH, MoveId.TACKLE];

    beforeEach(() => game.override.enemyMoveset(baseMoveset));

    it("should gain a large incentive to use on the first turn of battle", async () => {
      game.override.enemyMoveset([...baseMoveset, MoveId.SUPER_FANG]);

      await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

      const enemy = game.field.getEnemyPokemon();
      expect(enemy).toPreferSelectingMove(moveId);
    });

    it("should gain a small incentive to use after the first turn", async () => {
      await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

      const enemy = game.field.getEnemyPokemon();

      game.move.use(MoveId.SPLASH);
      await game.move.selectEnemyMove(MoveId.SPLASH);
      await game.toNextTurn();

      expect(enemy).toPreferSelectingMove(moveId);
    });
  });
});
