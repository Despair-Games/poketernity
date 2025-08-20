import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Heal Pulse", () => {
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
      .enemyMoveset([MoveId.HEAL_PULSE, MoveId.SPLASH, MoveId.SUPER_FANG])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when the user's ally is at low HP", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [enemy1, enemy2] = game.scene.getEnemyField();
    enemy2.hp = 1;

    expect(enemy1).toPreferSelectingMove(MoveId.HEAL_PULSE);
  });

  it("should be preferred when the user's ally is above half HP and the user is slower than an opponent", async () => {
    await game.classicMode.startBattle(SpeciesId.REGIELEKI, SpeciesId.MUNCHLAX);

    const [enemy1, enemy2] = game.scene.getEnemyField();
    enemy2.hp = Math.floor(enemy2.hp * 0.75);

    expect(enemy1).toPreferSelectingMove(MoveId.HEAL_PULSE);
  });

  it("should be avoided when the user's ally is at full HP", async () => {
    await game.classicMode.startBattle(SpeciesId.MUNCHLAX, SpeciesId.SNORLAX);

    const [enemy1] = game.scene.getEnemyField();
    expect(enemy1).toNeverSelectMove(MoveId.HEAL_PULSE);
  });

  it("should be avoided when the user's ally is afflicted with Heal Block", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    game.move.use(MoveId.SPLASH, 0);
    game.move.use(MoveId.HEAL_BLOCK, 1);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    const [enemy1] = game.scene.getEnemyField();
    expect(enemy1).toNeverSelectMove(MoveId.HEAL_PULSE);
  });

  it("should be avoided in single battles even when all other moves fail", async () => {
    game.override.battleType("single").enemyMoveset([MoveId.HEAL_PULSE, MoveId.SPIT_UP, MoveId.SWALLOW]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.HEAL_PULSE);
  });
});
