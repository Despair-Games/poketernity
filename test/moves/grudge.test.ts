import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { BattlerIndex } from "#enums/battler-index";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Grudge", () => {
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
      .moveset([MoveId.EMBER, MoveId.SPLASH])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.SHEDINJA)
      .enemyAbility(Abilities.WONDER_GUARD)
      .enemyMoveset([MoveId.GRUDGE, MoveId.SPLASH]);
  });

  it("should reduce the PP of the Pokemon's move to 0 when the user has fainted", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon();
    game.move.select(MoveId.EMBER);
    await game.forceEnemyMove(MoveId.GRUDGE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    const playerMove = playerPokemon?.getMoveset().find((m) => m.moveId === MoveId.EMBER);

    expect(playerMove?.getPpRatio()).toBe(0);
  });

  it("should remain in effect until the user's next move", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.scene.getPlayerPokemon();
    game.move.select(MoveId.SPLASH);
    await game.forceEnemyMove(MoveId.GRUDGE);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toNextTurn();

    game.move.select(MoveId.EMBER);
    await game.forceEnemyMove(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toEndOfTurn();

    const playerMove = playerPokemon?.getMoveset().find((m) => m.moveId === MoveId.EMBER);

    expect(playerMove?.getPpRatio()).toBe(0);
  });

  it("should not reduce the opponent's PP if the user dies to weather/indirect damage", async () => {
    // Opponent will be reduced to 1 HP by False Swipe, then faint to Sandstorm
    game.override
      .moveset([MoveId.FALSE_SWIPE])
      .startingLevel(100)
      .enemyAbility(Abilities.SAND_STREAM)
      .enemySpecies(Species.RATTATA);
    await game.classicMode.startBattle([Species.GEODUDE]);

    const enemyPokemon = game.scene.getEnemyPokemon();
    const playerPokemon = game.scene.getPlayerPokemon();

    game.move.select(MoveId.FALSE_SWIPE);
    await game.forceEnemyMove(MoveId.GRUDGE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    expect(enemyPokemon?.isFainted()).toBe(true);

    const playerMove = playerPokemon?.getMoveset().find((m) => m.moveId === MoveId.FALSE_SWIPE);
    expect(playerMove?.getPpRatio()).toBeGreaterThan(0);
  });
});
