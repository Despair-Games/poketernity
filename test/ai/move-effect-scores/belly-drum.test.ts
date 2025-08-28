import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { revealAllMoves } from "#test/test-utils/enemy-command-utils";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Belly Drum", () => {
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
      .enemyMoveset([MoveId.BELLY_DRUM, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be strongly preferred when the user isn't defensively threatened by the opponent", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.BELLY_DRUM);
  });

  it("should be avoided when the user is defensively threatened by the opponent", async () => {
    game.override.moveset(MoveId.THUNDERBOLT);
    await game.classicMode.startBattle(SpeciesId.REGIELEKI);

    revealAllMoves(game.scene);
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.BELLY_DRUM);
  });

  it("should be avoided when the user has Contrary", async () => {
    game.override.enemyAbility(AbilityId.CONTRARY);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.BELLY_DRUM);
  });
});
