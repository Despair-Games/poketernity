import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Pollen Puff", () => {
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
      .battleType("double")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.POLLEN_PUFF, MoveId.SPLASH, MoveId.SUPER_FANG])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the user's ally is at low HP", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [enemy1, enemy2] = game.scene.getEnemyField();
    enemy2.hp = 1;

    expect(enemy1).toPreferSelectingMove(MoveId.POLLEN_PUFF);
  });

  it("should be preferred when the user's ally is above half HP and the user is slower than an opponent", async () => {
    await game.classicMode.startBattle(SpeciesId.REGIELEKI, SpeciesId.MAGIKARP);

    const [enemy1, enemy2] = game.scene.getEnemyField();
    enemy2.hp = Math.floor(enemy2.hp * 0.75);

    expect(enemy1).toPreferSelectingMove(MoveId.POLLEN_PUFF);
  });

  it("should not be preferred when the user's ally is at full HP", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGMAR, SpeciesId.MAGMORTAR);

    const [enemy1] = game.scene.getEnemyField();
    expect(enemy1).not.toPreferSelectingMove(MoveId.POLLEN_PUFF);
  });

  it("should not be preferred when the user's ally is afflicted with Heal Block", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGMAR, SpeciesId.MAGMORTAR);

    game.move.use(MoveId.HEAL_BLOCK, 0);
    game.move.use(MoveId.SPLASH, 1);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    const [enemy1] = game.scene.getEnemyField();
    expect(enemy1).not.toPreferSelectingMove(MoveId.POLLEN_PUFF);
  });

  it("should not be penalized in single battles", async () => {
    game.override.battleType("single").enemyMoveset([MoveId.POLLEN_PUFF, MoveId.SPLASH, MoveId.TACKLE]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.POLLEN_PUFF);
  });
});
