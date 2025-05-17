import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Gravity", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  const baseMoveset = [MoveId.GRAVITY, MoveId.SPLASH, MoveId.TACKLE];

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
      .enemyMoveset(baseMoveset)
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the enemy has a low-accuracy move", async () => {
    game.override.enemyMoveset([...baseMoveset, MoveId.SUPERSONIC]);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.GRAVITY);
  });

  it("should be preferred when the enemy is a Ground-type Pokemon", async () => {
    game.override.enemySpecies(SpeciesId.DRILBUR);

    await game.classicMode.startBattle([SpeciesId.AGGRON]);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.GRAVITY);
  });

  it("should not be preferred when none of the above conditions are present", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.GRAVITY);
  });

  it("should be avoided when its effect is already active", async () => {
    game.override.enemySpecies(SpeciesId.DRILBUR);

    await game.classicMode.startBattle([SpeciesId.MAGIKARP]);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.GRAVITY);
    await game.toNextTurn();

    expect(enemy).toNeverSelectMove(MoveId.GRAVITY);
  });
});
