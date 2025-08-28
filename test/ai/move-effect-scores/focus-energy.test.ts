import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Focus Energy", () => {
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
      .enemyMoveset([MoveId.FOCUS_ENERGY, MoveId.TACKLE, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred over moves with low-impact", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.FOCUS_ENERGY);
  });

  it("should have greater incentive when the user has a move with a high critical hit ratio", async () => {
    game.override.enemyMoveset([MoveId.FOCUS_ENERGY, MoveId.SWORDS_DANCE, MoveId.PSYCHO_CUT]);

    await game.classicMode.startBattle(SpeciesId.POOCHYENA);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.FOCUS_ENERGY);
  });

  it("should not have high incentive when the user does not have a move with a high critical hit ratio", async () => {
    game.override.enemyMoveset([MoveId.FOCUS_ENERGY, MoveId.SUPER_FANG]);

    await game.classicMode.startBattle(SpeciesId.POOCHYENA);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.FOCUS_ENERGY);
  });

  it("should be avoided when the user is already under Focus Energy's effect", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.FOCUS_ENERGY);
    await game.toNextTurn();

    expect(enemy).toNeverSelectMove(MoveId.FOCUS_ENERGY);
  });
});
