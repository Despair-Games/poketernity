import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Explosion", () => {
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
      .enemyMoveset([MoveId.EXPLOSION, MoveId.TACKLE, MoveId.SPLASH])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be preferred when the user cannot KO any opponents", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [enemy] = game.scene.getEnemyField();
    expect(enemy).not.toPreferSelectingMove(MoveId.EXPLOSION);
  });

  it("should be preferred when the user can KO both opponents", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    for (const player of game.scene.getPlayerField()) {
      player.hp = 1;
    }

    const [enemy] = game.scene.getEnemyField();
    expect(enemy).toPreferSelectingMove(MoveId.EXPLOSION);
  });

  it("should be preferred when the user is critically damaged", async () => {
    game.override.enemySpecies(SpeciesId.DUSKULL);
    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [enemy] = game.scene.getEnemyField();
    enemy.hp = 1;

    expect(enemy).toPreferSelectingMove(MoveId.EXPLOSION);
  });

  it("should be avoided compared to other attacks with no effect", async () => {
    game.override.enemySpecies(SpeciesId.DUSKULL).enemyMoveset([MoveId.EXPLOSION, MoveId.BOOMBURST]);

    await game.classicMode.startBattle(SpeciesId.DUSKULL, SpeciesId.SHUPPET);

    const [enemy] = game.scene.getEnemyField();
    expect(enemy).toNeverSelectMove(MoveId.EXPLOSION);
  });

  it("should be avoided when opposing Pokemon have Damp", async () => {
    game.override.ability(AbilityId.DAMP);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    game.field.revealAllAbilities();
    for (const player of game.scene.getPlayerField()) {
      player.hp = 1;
    }

    const [enemy] = game.scene.getEnemyField();
    expect(enemy).toNeverSelectMove(MoveId.EXPLOSION);
  });
});
