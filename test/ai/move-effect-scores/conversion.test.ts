import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Conversion", () => {
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
      .enemyMoveset([MoveId.SMART_STRIKE, MoveId.CONVERSION, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the user's type matchup would improve", async () => {
    await game.classicMode.startBattle(SpeciesId.CHIKORITA);
    game.field.setSpeed(50, 100);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.CONVERSION);
  });

  it("should be avoided when the user's type matchup would worsen", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGBY);
    game.field.setSpeed(50, 100);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.CONVERSION);
  });

  it("should not be preferred when the user is slower than its opponent", async () => {
    await game.classicMode.startBattle(SpeciesId.CHIKORITA);
    game.field.setSpeed(100, 50);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.CONVERSION);
  });
});
