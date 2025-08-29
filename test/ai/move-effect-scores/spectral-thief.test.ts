import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Spectral Thief", () => {
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
      .enemyMoveset([MoveId.SPECTRAL_THIEF, MoveId.EARTHQUAKE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be preferred when the target has no positive stat stages", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.SPECTRAL_THIEF);
  });

  it("should be preferred when the target has at least one positive stat stage", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.setStatStage(Stat.ATK, 1);

    expect(enemy).toPreferSelectingMove(MoveId.SPECTRAL_THIEF);
  });

  it("should be strongly preferred when the target has several positive stat stages", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.setStatStage(Stat.ATK, 6);

    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.SPECTRAL_THIEF);
  });

  it("should be avoided when the user has Contrary and would steal stat stages", async () => {
    game.override.enemyAbility(AbilityId.CONTRARY);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.setStatStage(Stat.ATK, 6);

    expect(enemy).toNeverSelectMove(MoveId.SPECTRAL_THIEF);
  });

  it("should be preferred over priority moves that KO when the target is boosted", async () => {
    game.override.enemyMoveset([MoveId.SPECTRAL_THIEF, MoveId.QUICK_ATTACK]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.setStatStage(Stat.ATK, 6);
    player.hp = 1;

    expect(enemy).toPreferSelectingMove(MoveId.SPECTRAL_THIEF);
  });
});
