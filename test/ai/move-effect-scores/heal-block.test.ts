import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { revealAllMoves } from "#test/test-utils/enemy-command-utils";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Heal Block", () => {
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
      .enemyMoveset([MoveId.HEAL_BLOCK, MoveId.TACKLE, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred over low-impact moves", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.HEAL_BLOCK);
  });

  it.each([
    { moveName: "Recover", moveId: MoveId.RECOVER },
    { moveName: "Absorb", moveId: MoveId.ABSORB },
    { moveName: "Wish", moveId: MoveId.WISH },
  ])("should be strongly preferred if the opponent is known to have $moveName in their moveset", async ({ moveId }) => {
    game.override.moveset(moveId).enemyMoveset([MoveId.HEAL_BLOCK, MoveId.SUPER_FANG, MoveId.SPLASH]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    revealAllMoves(game.scene);
    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.HEAL_BLOCK);
  });

  it("should be avoided if the opponent is already under Heal Block's effect", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.HEAL_BLOCK);
    await game.toNextTurn();

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.HEAL_BLOCK);
  });
});
