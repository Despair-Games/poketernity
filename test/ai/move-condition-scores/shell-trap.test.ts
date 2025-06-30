import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Condition Scores - Shell Trap", () => {
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
      .enemyMoveset([MoveId.SHELL_TRAP, MoveId.SPLASH, MoveId.TACKLE])
      .ability(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be penalized when all opponents have an Attack bias", async () => {
    await game.classicMode.startBattle(SpeciesId.EXCADRILL, SpeciesId.DRILBUR);

    const [enemy] = game.scene.getEnemyField();

    expect(enemy).toPreferSelectingMove(MoveId.SHELL_TRAP);
  });

  it("should be penalized when all opponents have a Sp. Atk bias", async () => {
    await game.classicMode.startBattle(SpeciesId.TOGETIC, SpeciesId.TOGEKISS);

    const [enemy] = game.scene.getEnemyField();

    expect(enemy).toNeverSelectMove(MoveId.SHELL_TRAP);
  });

  it("should be given a small penalty when one opponent has an Attack bias", async () => {
    game.override.enemyMoveset([MoveId.SHELL_TRAP, MoveId.SPIT_UP, MoveId.SWALLOW]);

    await game.classicMode.startBattle(SpeciesId.EXCADRILL, SpeciesId.TOGEKISS);

    const [enemy] = game.scene.getEnemyField();

    expect(enemy).toPreferSelectingMove(MoveId.SHELL_TRAP);
  });
});
