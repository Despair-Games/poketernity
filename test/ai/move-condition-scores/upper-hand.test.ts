import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { revealAllMoves } from "#test/test-utils/enemy-command-utils";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Condition Scores - Upper Hand", () => {
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
      .enemyMoveset([MoveId.UPPER_HAND, MoveId.SPLASH, MoveId.SPIT_UP])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be penalized if the target doesn't have a high-priority move", async () => {
    game.override.moveset([MoveId.TACKLE, MoveId.SPLASH]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    revealAllMoves(game.scene);
    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toNeverSelectMove(MoveId.UPPER_HAND);
  });

  it("should be given a reduced penalty if the target's best attack has high priority", async () => {
    game.override.moveset([MoveId.TACKLE, MoveId.QUICK_ATTACK]).enemyMoveset([MoveId.UPPER_HAND, MoveId.SPIT_UP]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    revealAllMoves(game.scene);
    const enemy = game.field.getEnemyPokemon();
    // Set Enemy to 1 HP to allow all of the Player's attacks to KO.
    // High-priority moves gain a major bonus to AS when they can KO opponents
    enemy.hp = 1;

    expect(enemy).toPreferSelectingMove(MoveId.UPPER_HAND);
  });

  it("should be penalized if the target's moves are unknown", async () => {
    game.override.moveset([MoveId.TACKLE, MoveId.QUICK_ATTACK]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    // Set Enemy to 1 HP to allow all of the Player's attacks to KO.
    // High-priority moves gain a major bonus to AS when they can KO opponents
    enemy.hp = 1;

    expect(enemy).toNeverSelectMove(MoveId.UPPER_HAND);
  });
});
