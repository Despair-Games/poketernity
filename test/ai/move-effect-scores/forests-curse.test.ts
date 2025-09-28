import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Forests Curse", () => {
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

  const baseMoveset = [MoveId.FORESTS_CURSE, MoveId.SPLASH, MoveId.TACKLE];

  beforeEach(() => {
    game = new GameManager(phaserGame);
    game.override
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(baseMoveset)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the user has a move that would gain type effectiveness", async () => {
    game.override.enemyMoveset([MoveId.EMBER, ...baseMoveset]);

    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.FORESTS_CURSE);
  });

  it("should not be preferred when the user does not have a move that would gain type effectiveness", async () => {
    await game.classicMode.startBattle(SpeciesId.FEEBAS);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.FORESTS_CURSE);
  });
});
