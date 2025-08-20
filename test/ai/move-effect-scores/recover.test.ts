import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Recover", () => {
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
      .enemyMoveset([MoveId.RECOVER, MoveId.SPLASH, MoveId.SUPER_FANG])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the user is at low HP", async () => {
    await game.classicMode.startBattle(SpeciesId.MUNCHLAX);

    const enemy = game.field.getEnemyPokemon();
    enemy.hp = 1;
    expect(enemy).toPreferSelectingMove(MoveId.RECOVER);
  });

  it("should be preferred when the user is above half HP and is slower than the target", async () => {
    await game.classicMode.startBattle(SpeciesId.BARRASKEWDA);

    const enemy = game.field.getEnemyPokemon();
    enemy.hp = Math.floor(enemy.hp * 0.75);
    expect(enemy).toPreferSelectingMove(MoveId.RECOVER);
  });

  it("should not be preferred when the user is above half HP and is faster than the target", async () => {
    await game.classicMode.startBattle(SpeciesId.MUNCHLAX);

    const enemy = game.field.getEnemyPokemon();
    enemy.hp = Math.floor(enemy.hp * 0.75);
    expect(enemy).not.toPreferSelectingMove(MoveId.RECOVER);
  });

  it("should be avoided when the user is at full HP", async () => {
    await game.classicMode.startBattle(SpeciesId.BARRASKEWDA);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.RECOVER);
  });

  it("should be avoided when the user is under the effects of Heal Block", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    enemy.hp = 1;

    game.move.use(MoveId.HEAL_BLOCK);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    expect(enemy).toNeverSelectMove(MoveId.RECOVER);
  });
});
