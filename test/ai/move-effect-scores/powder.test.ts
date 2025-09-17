import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Powder", () => {
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
      .enemyMoveset([MoveId.POWDER, MoveId.TACKLE, MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the target is known to have a Fire-type attack", async () => {
    game.override.moveset([MoveId.EMBER, MoveId.SPLASH]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.POWDER);

    game.field.revealAllMoves();
    expect(enemy).toPreferSelectingMove(MoveId.POWDER);
  });

  it("should be preferred when the target is a Fire-type Pokemon", async () => {
    await game.classicMode.startBattle(SpeciesId.CHARMANDER);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.POWDER);
  });

  it("should not be preferred when the target is known to not have any Fire-type attack", async () => {
    game.override.moveset([MoveId.TACKLE, MoveId.SPLASH, MoveId.CELEBRATE, MoveId.POUND]);

    await game.classicMode.startBattle(SpeciesId.CHARMANDER);

    const enemy = game.field.getEnemyPokemon();

    game.field.revealAllMoves();
    expect(enemy).not.toPreferSelectingMove(MoveId.POWDER);
  });
});
