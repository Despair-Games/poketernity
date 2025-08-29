import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Psych Up", () => {
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
      .enemyMoveset([MoveId.PSYCH_UP, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  const initTest = async ({ playerStatStage = 0, enemyStatStage = 0 } = {}) => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    player.setStatStage(Stat.ATK, playerStatStage);
    enemy.setStatStage(Stat.ATK, enemyStatStage);
  };

  it("should be avoided when the target has no positive stat stages", async () => {
    await initTest();

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.PSYCH_UP);
  });

  it("should not be preferred when the target has one positive stat stage", async () => {
    await initTest({ playerStatStage: 1 });

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.PSYCH_UP);
  });

  it("should be preferred when the target has two more stat stages than the user", async () => {
    await initTest({ playerStatStage: 4, enemyStatStage: 2 });

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toPreferSelectingMove(MoveId.PSYCH_UP);
  });

  it("should be avoided when the user has more stat stages than the target", async () => {
    await initTest({ playerStatStage: 2, enemyStatStage: 4 });

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).toNeverSelectMove(MoveId.PSYCH_UP);
  });

  it("should be preferred when the user's ally has boosted stats", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const [enemy1, enemy2] = game.scene.getEnemyField();
    enemy2.setStatStage(Stat.ATK, 2);

    expect(enemy1).toPreferSelectingMove(MoveId.PSYCH_UP);
  });
});
