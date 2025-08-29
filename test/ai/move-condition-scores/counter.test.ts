import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Condition Scores - Counter", () => {
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
      .enemyMoveset([MoveId.COUNTER, MoveId.SPLASH, MoveId.SPIT_UP])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be penalized if the opponent knows a Physical attack", async () => {
    game.override.moveset([MoveId.TACKLE, MoveId.SPLASH, MoveId.WATER_GUN, MoveId.GROWL]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.field.revealAllMoves();
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).not.toNeverSelectMove(MoveId.COUNTER);
  });

  it("should be penalized if the opponent only knows Special attacks", async () => {
    game.override.moveset([MoveId.WATER_GUN, MoveId.ABSORB, MoveId.SPLASH, MoveId.GROWL]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.field.revealAllMoves();
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toNeverSelectMove(MoveId.COUNTER);
  });

  it("should be penalized if the opponent can KO the user", async () => {
    game.override.moveset([MoveId.TACKLE, MoveId.FISSURE]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.field.revealAllMoves();
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toNeverSelectMove(MoveId.COUNTER);
  });
});
