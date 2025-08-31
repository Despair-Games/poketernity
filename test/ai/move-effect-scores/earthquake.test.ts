import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Earthquake", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .battleType("double")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.EARTHQUAKE, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should be preferred when all targets can be hit", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [enemy] = game.scene.getEnemyField();
    expect(enemy).toPreferSelectingMove(MoveId.EARTHQUAKE);
  });

  it("should be preferred when all targets can be knocked out", async () => {
    // Remove Tackle since it would have the same AS in this situation
    game.override.enemyMoveset([MoveId.EARTHQUAKE, MoveId.SPLASH]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    for (const p of game.scene.getField(true)) {
      p.hp = 1;
    }

    const [enemy] = game.scene.getEnemyField();
    expect(enemy).toPreferSelectingMove(MoveId.EARTHQUAKE);
  });

  it("should be avoided when only the user's ally can be knocked out", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [enemy1, enemy2] = game.scene.getEnemyField();
    enemy2.hp = 1;

    expect(enemy1).toNeverSelectMove(MoveId.EARTHQUAKE);
  });

  it("should be avoided when all targets are immune", async () => {
    // Player Pokemon are both Flying-type
    await game.classicMode.startBattle(SpeciesId.DUCKLETT, SpeciesId.WINGULL);

    const [enemy] = game.scene.getEnemyField();
    expect(enemy).toNeverSelectMove(MoveId.EARTHQUAKE);
  });

  it("should be preferred when the user's ally is immune", async () => {
    // Enemy Pokemon are both Flying-type
    game.override.enemySpecies(SpeciesId.DUCKLETT);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [enemy1, enemy2] = game.scene.getEnemyField();
    enemy2.hp = 1;

    expect(enemy1).toPreferSelectingMove(MoveId.EARTHQUAKE);
  });
});
