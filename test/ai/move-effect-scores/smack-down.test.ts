import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Smack Down", () => {
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
      .enemySpecies(SpeciesId.DIGLETT)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.SMACK_DOWN, MoveId.BULLDOZE, MoveId.ASSURANCE, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred if the user is Ground-type against a Flying-type target", async () => {
    await game.classicMode.startBattle(SpeciesId.SKARMORY);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.SMACK_DOWN);
  });

  it("should not be preferred if the user is not Ground-type", async () => {
    game.override.enemySpecies(SpeciesId.MAGIKARP);
    await game.classicMode.startBattle(SpeciesId.SKARMORY);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.SMACK_DOWN);
  });

  it("should not be preferred if the target is already grounded", async () => {
    await game.classicMode.startBattle(SpeciesId.SKARMORY);

    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.SMACK_DOWN);
    await game.toNextTurn();

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.SMACK_DOWN);
  });
});
