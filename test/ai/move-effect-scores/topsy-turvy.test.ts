import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("AI (Move Effect Scores) - Topsy Turvy", () => {
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
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.TOPSY_TURVY, MoveId.SPLASH, MoveId.TACKLE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be preferred when the target has no stat changes", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.TOPSY_TURVY);
  });

  it("should be preferred when the target has an increased stat stage", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.setStatStage(Stat.ATK, 1);

    expect(enemy).toPreferSelectingMove(MoveId.TOPSY_TURVY);
  });

  it("should be avoided when the target has a decreased stat stage", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.setStatStage(Stat.ATK, -1);

    expect(enemy).toNeverSelectMove(MoveId.TOPSY_TURVY);
  });

  it("should not be prioritized over KO moves", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.hp = 1;
    player.setStatStage(Stat.ATK, 6);

    expect(enemy).toNeverSelectMove(MoveId.TOPSY_TURVY);
  });

  it("should be preferred when an ally has a decreased stat stage", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [enemy1, enemy2] = game.scene.getEnemyField();
    enemy2.setStatStage(Stat.ATK, -1);

    expect(enemy1).toPreferSelectingMove(MoveId.TOPSY_TURVY);
  });

  it("should be avoided when an ally has an increased stat stage", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    const [enemy1, enemy2] = game.scene.getEnemyField();
    // Set opponents to -1 ATK to make them unfavorable targets
    game.scene.getPlayerField().forEach((p) => p.setStatStage(Stat.ATK, -1));
    enemy2.setStatStage(Stat.ATK, 1);

    expect(enemy1).toNeverSelectMove(MoveId.TOPSY_TURVY);
  });
});
