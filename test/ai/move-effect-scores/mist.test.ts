import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Mist", () => {
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
      .enemyAbility(AbilityId.TORRENT)
      .ability(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.MIST, MoveId.SPLASH])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("Enemy should prefer selecting Mist on its first turn in battle", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).toPreferSelectingMove(MoveId.MIST);
  });

  it("Enemy should not prefer selecting Mist after its first turn in battle", async () => {
    game.override.enemyMoveset([MoveId.MIST, MoveId.TACKLE, MoveId.SPLASH]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.SPLASH);

    await game.toNextTurn();

    expect(enemy).not.toPreferSelectingMove(MoveId.MIST);
  });

  it("Enemy should not prefer selecting Mist over attacks with AS > 1", async () => {
    game.override.enemyMoveset([MoveId.MIST, MoveId.SUPER_FANG]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    expect(enemy).not.toPreferSelectingMove(MoveId.MIST);
  });

  it("Enemy should prefer selecting Mist after switching in", async () => {
    game.override.startingWave(8); // Forced Trainer fight

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.forceEnemyToSwitch(1);
    await game.toNextTurn();

    game.move.use(MoveId.SPLASH);
    await game.forceEnemyToSwitch(1);
    await game.toNextTurn();

    expect(enemy).toPreferSelectingMove(MoveId.MIST);
  });

  it("Enemy should avoid selecting Mist if Mist is already active", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.MIST);

    await game.toNextTurn();

    expect(enemy).toNeverSelectMove(MoveId.MIST);
  });
});
