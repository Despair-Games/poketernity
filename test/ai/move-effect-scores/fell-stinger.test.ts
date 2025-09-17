import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Move Effect Scores - Fell Stinger", () => {
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
      .enemySpecies(SpeciesId.DRILBUR)
      .enemyAbility(AbilityId.BALL_FETCH)
      .ability(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.FELL_STINGER, MoveId.AERIAL_ACE])
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should not be preferred when the user cannot KO the target", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const enemy = game.field.getEnemyPokemon();
    expect(enemy).not.toPreferSelectingMove(MoveId.FELL_STINGER);
  });

  it("should be strongly preferred when the user can KO the target", async () => {
    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.hp = 1;

    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.FELL_STINGER);
  });

  it("should be strongly preferred over priority moves when the user can KO the target", async () => {
    game.override.enemyMoveset([MoveId.FELL_STINGER, MoveId.QUICK_ATTACK]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.hp = 1;

    expect(enemy).toNeverSelectMove((move) => move.id !== MoveId.FELL_STINGER);
  });

  it("should not be preferred when the user already has max Attack stages", async () => {
    game.override.enemyMoveset([MoveId.FELL_STINGER, MoveId.QUICK_ATTACK]);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.hp = 1;
    enemy.setStatStage(Stat.ATK, 6);

    expect(enemy).toNeverSelectMove(MoveId.FELL_STINGER);
  });

  it("should be avoided when the user has Contrary", async () => {
    game.override.enemyAbility(AbilityId.CONTRARY);

    await game.classicMode.startBattle(SpeciesId.MAGIKARP);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();
    player.hp = 1;

    expect(enemy).toNeverSelectMove(MoveId.FELL_STINGER);
  });
});
