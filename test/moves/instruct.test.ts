import { BattlerIndex } from "#app/battle";
import type { Pokemon } from "#app/field/pokemon";
import { MoveResult } from "#app/field/pokemon";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Instruct", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  function instructSuccess(pokemon: Pokemon, move: Moves): void {
    expect(pokemon.getLastXMoves(-1)[0].move).toBe(move);
    expect(pokemon.getLastXMoves(-1)[1].move).toBe(pokemon.getLastXMoves()[0].move);
    expect(pokemon.getMoveset().find((m) => m?.moveId === move)?.ppUsed).toBe(2);
  }

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
    game.overridesHelper
      .battleType("single")
      .enemySpecies(Species.SHUCKLE)
      .enemyAbility(Abilities.NO_GUARD)
      .enemyLevel(100)
      .startingLevel(100)
      .ability(Abilities.BALL_FETCH)
      .moveset([Moves.INSTRUCT, Moves.SONIC_BOOM, Moves.SPLASH, Moves.TORMENT])
      .disableCrits();
  });

  it("should repeat enemy's attack move when moving last", async () => {
    await game.classicModeHelper.startBattle([Species.AMOONGUSS]);

    const enemy = game.scene.getEnemyPokemon()!;
    game.moveHelper.changeMoveset(enemy, Moves.SONIC_BOOM);

    game.moveHelper.select(Moves.INSTRUCT, BattlerIndex.PLAYER, BattlerIndex.ENEMY);
    await game.forceEnemyMove(Moves.SONIC_BOOM, BattlerIndex.PLAYER);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("TurnEndPhase", false);

    expect(game.scene.getPlayerPokemon()?.getInverseHp()).toBe(40);
    instructSuccess(enemy, Moves.SONIC_BOOM);
  });

  it("should repeat enemy's move through substitute", async () => {
    await game.classicModeHelper.startBattle([Species.AMOONGUSS]);

    const enemy = game.scene.getEnemyPokemon()!;
    game.moveHelper.changeMoveset(enemy, [Moves.SONIC_BOOM, Moves.SUBSTITUTE]);

    game.moveHelper.select(Moves.SPLASH);
    await game.forceEnemyMove(Moves.SUBSTITUTE);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toNextTurn();

    game.moveHelper.select(Moves.INSTRUCT);
    await game.forceEnemyMove(Moves.SONIC_BOOM);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("TurnEndPhase", false);

    expect(game.scene.getPlayerPokemon()?.getInverseHp()).toBe(40);
    instructSuccess(game.scene.getEnemyPokemon()!, Moves.SONIC_BOOM);
  });

  it("should repeat ally's attack on enemy", async () => {
    game.overridesHelper.battleType("double").moveset([]);
    await game.classicModeHelper.startBattle([Species.AMOONGUSS, Species.SHUCKLE]);

    const [amoonguss, shuckle] = game.scene.getPlayerField();
    game.moveHelper.changeMoveset(amoonguss, Moves.INSTRUCT);
    game.moveHelper.changeMoveset(shuckle, Moves.SONIC_BOOM);

    game.moveHelper.select(Moves.INSTRUCT, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2);
    game.moveHelper.select(Moves.SONIC_BOOM, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.setTurnOrder([BattlerIndex.PLAYER_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.phaseInterceptor.to("TurnEndPhase", false);

    expect(game.scene.getEnemyField()[0].getInverseHp()).toBe(40);
    instructSuccess(shuckle, Moves.SONIC_BOOM);
  });

  // TODO: Enable test case once gigaton hammer (and blood moon) is fixed
  it.todo("should repeat enemy's Gigaton Hammer", async () => {
    game.overridesHelper.enemyLevel(5);
    await game.classicModeHelper.startBattle([Species.AMOONGUSS]);

    const enemy = game.scene.getEnemyPokemon()!;
    game.moveHelper.changeMoveset(enemy, Moves.GIGATON_HAMMER);

    game.moveHelper.select(Moves.INSTRUCT);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("TurnEndPhase", false);

    instructSuccess(enemy, Moves.GIGATON_HAMMER);
  });

  it("should respect enemy's status condition", async () => {
    game.overridesHelper.moveset([Moves.THUNDER_WAVE, Moves.INSTRUCT]).enemyMoveset([Moves.SPLASH, Moves.SONIC_BOOM]);
    await game.classicModeHelper.startBattle([Species.AMOONGUSS]);

    game.moveHelper.select(Moves.THUNDER_WAVE);
    await game.forceEnemyMove(Moves.SONIC_BOOM);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    game.moveHelper.select(Moves.INSTRUCT);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.moveHelper.forceStatusActivation(true);
    await game.phaseInterceptor.to("MovePhase");
    await game.moveHelper.forceStatusActivation(false);
    await game.phaseInterceptor.to("TurnEndPhase", false);

    const moveHistory = game.scene.getEnemyPokemon()!.getMoveHistory();
    expect(moveHistory.length).toBe(3);
    expect(moveHistory[0].move).toBe(Moves.SONIC_BOOM);
    expect(moveHistory[1].move).toBe(Moves.NONE);
    expect(moveHistory[2].move).toBe(Moves.SONIC_BOOM);
  });

  it("should not repeat enemy's out of pp move", async () => {
    game.overridesHelper.enemySpecies(Species.UNOWN);
    await game.classicModeHelper.startBattle([Species.AMOONGUSS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    game.moveHelper.changeMoveset(enemyPokemon, Moves.HIDDEN_POWER);
    const moveUsed = enemyPokemon.moveset.find((m) => m?.moveId === Moves.HIDDEN_POWER)!;
    moveUsed.ppUsed = moveUsed.getMovePp() - 1;

    game.moveHelper.select(Moves.INSTRUCT);
    await game.forceEnemyMove(Moves.HIDDEN_POWER);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("TurnEndPhase", false);

    const playerMove = game.scene.getPlayerPokemon()!.getLastXMoves()!;
    expect(playerMove[0].result).toBe(MoveResult.FAIL);
    expect(enemyPokemon.getMoveHistory().length).toBe(1);
  });

  it("should fail if no move has yet been used by target", async () => {
    game.overridesHelper.enemyMoveset(Moves.SPLASH);
    await game.classicModeHelper.startBattle([Species.AMOONGUSS]);

    game.moveHelper.select(Moves.INSTRUCT);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("TurnEndPhase", false);

    expect(game.scene.getPlayerPokemon()!.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });

  it("should attempt to call enemy's disabled move, but move use itself should fail", async () => {
    game.overridesHelper.moveset([Moves.INSTRUCT, Moves.DISABLE]).battleType("double");
    await game.classicModeHelper.startBattle([Species.AMOONGUSS, Species.DROWZEE]);

    const [enemy1, enemy2] = game.scene.getEnemyField();
    game.moveHelper.changeMoveset(enemy1, Moves.SONIC_BOOM);
    game.moveHelper.changeMoveset(enemy2, Moves.SPLASH);

    game.moveHelper.select(Moves.INSTRUCT, BattlerIndex.PLAYER, BattlerIndex.ENEMY);
    game.moveHelper.select(Moves.DISABLE, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY);
    await game.forceEnemyMove(Moves.SONIC_BOOM, BattlerIndex.PLAYER);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY_2]);
    await game.phaseInterceptor.to("TurnEndPhase", false);

    expect(game.scene.getPlayerField()[0].getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    const enemyMove = game.scene.getEnemyPokemon()!.getLastXMoves()[0];
    expect(enemyMove.result).toBe(MoveResult.FAIL);
    expect(
      game.scene
        .getEnemyPokemon()!
        .getMoveset()
        .find((m) => m?.moveId === Moves.SONIC_BOOM)?.ppUsed,
    ).toBe(1);
  });

  it("should not repeat enemy's move through protect", async () => {
    await game.classicModeHelper.startBattle([Species.AMOONGUSS]);

    const MoveToUse = Moves.PROTECT;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    game.moveHelper.changeMoveset(enemyPokemon, MoveToUse);
    game.moveHelper.select(Moves.INSTRUCT);
    await game.forceEnemyMove(Moves.PROTECT);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("TurnEndPhase", false);

    expect(enemyPokemon.getLastXMoves(-1)[0].move).toBe(Moves.PROTECT);
    expect(enemyPokemon.getLastXMoves(-1)[1]).toBeUndefined(); // undefined because protect failed
    expect(enemyPokemon.getMoveset().find((m) => m?.moveId === Moves.PROTECT)?.ppUsed).toBe(1);
  });

  it("should not repeat enemy's charging move", async () => {
    game.overridesHelper.enemyMoveset([Moves.SONIC_BOOM, Moves.HYPER_BEAM]).enemyLevel(5);
    await game.classicModeHelper.startBattle([Species.SHUCKLE]);

    const player = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    enemyPokemon.battleSummonData.moveHistory = [
      { move: Moves.SONIC_BOOM, targets: [BattlerIndex.PLAYER], result: MoveResult.SUCCESS, virtual: false },
    ];

    game.moveHelper.select(Moves.INSTRUCT);
    await game.forceEnemyMove(Moves.HYPER_BEAM);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(player.getLastXMoves()[0].result).toBe(MoveResult.FAIL);

    game.moveHelper.select(Moves.INSTRUCT);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("TurnEndPhase", false);

    expect(player.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });

  it("should not repeat dance move not known by target", async () => {
    game.overridesHelper
      .battleType("double")
      .moveset([Moves.INSTRUCT, Moves.FIERY_DANCE])
      .enemyMoveset(Moves.SPLASH)
      .enemyAbility(Abilities.DANCER);
    await game.classicModeHelper.startBattle([Species.SHUCKLE, Species.SHUCKLE]);

    game.moveHelper.select(Moves.INSTRUCT, BattlerIndex.PLAYER, BattlerIndex.ENEMY);
    game.moveHelper.select(Moves.FIERY_DANCE, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.setTurnOrder([BattlerIndex.PLAYER_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.phaseInterceptor.to("TurnEndPhase", false);

    expect(game.scene.getPlayerField()[0].getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });

  it("should cause multi-hit moves to hit the appropriate number of times in singles", async () => {
    game.overridesHelper.enemyAbility(Abilities.SKILL_LINK).enemyMoveset(Moves.BULLET_SEED);
    await game.classicModeHelper.startBattle([Species.BULBASAUR]);

    const player = game.scene.getPlayerPokemon()!;

    game.moveHelper.select(Moves.SPLASH);
    await game.toNextTurn();

    game.moveHelper.select(Moves.INSTRUCT);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("BerryPhase");

    expect(player.turnData.attacksReceived.length).toBe(10);

    await game.toNextTurn();
    game.moveHelper.select(Moves.INSTRUCT);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("BerryPhase");

    expect(player.turnData.attacksReceived.length).toBe(10);
  });

  it("should cause multi-hit moves to hit the appropriate number of times in doubles", async () => {
    game.overridesHelper
      .battleType("double")
      .enemyAbility(Abilities.SKILL_LINK)
      .enemyMoveset([Moves.BULLET_SEED, Moves.SPLASH])
      .enemyLevel(5);
    await game.classicModeHelper.startBattle([Species.BULBASAUR, Species.IVYSAUR]);

    const [, ivysaur] = game.scene.getPlayerField();

    game.moveHelper.select(Moves.SPLASH);
    game.moveHelper.select(Moves.SPLASH, 1);
    await game.forceEnemyMove(Moves.BULLET_SEED, BattlerIndex.PLAYER_2);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.toNextTurn();

    game.moveHelper.select(Moves.INSTRUCT, 0, BattlerIndex.ENEMY);
    game.moveHelper.select(Moves.INSTRUCT, 1, BattlerIndex.ENEMY);
    await game.forceEnemyMove(Moves.BULLET_SEED, BattlerIndex.PLAYER_2);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.phaseInterceptor.to("BerryPhase");

    expect(ivysaur.turnData.attacksReceived.length).toBe(15);

    await game.toNextTurn();
    game.moveHelper.select(Moves.INSTRUCT, 0, BattlerIndex.ENEMY);
    game.moveHelper.select(Moves.INSTRUCT, 1, BattlerIndex.ENEMY);
    await game.forceEnemyMove(Moves.BULLET_SEED, BattlerIndex.PLAYER_2);
    await game.forceEnemyMove(Moves.SPLASH);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);
    await game.phaseInterceptor.to("BerryPhase");

    expect(ivysaur.turnData.attacksReceived.length).toBe(15);
  });
});
