import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Disable", () => {
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
      .enemySpecies(SpeciesId.REGIELEKI)
      .enemyAbility(AbilityId.STURDY)
      .enemyMoveset([MoveId.DISABLE, MoveId.TACKLE, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .moveset([MoveId.EARTHQUAKE, MoveId.SPLASH])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the target's last move deals significant damage to the user", async () => {
    await game.classicMode.startBattle([SpeciesId.EXCADRILL]);

    const enemy = game.field.getEnemyPokemon();

    game.move.select(MoveId.EARTHQUAKE);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    expect(enemy).toPreferSelectingMove(MoveId.DISABLE);
  });

  it("should not be preferred when the target's last move does nothing", async () => {
    await game.classicMode.startBattle([SpeciesId.EXCADRILL]);

    const enemy = game.field.getEnemyPokemon();

    game.move.select(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    expect(enemy).not.toPreferSelectingMove(MoveId.SPLASH);
  });
});
