import { BattlerIndex } from "#enums/battler-index";
import type { Pokemon } from "#app/field/pokemon";
import { MoveResult } from "#enums/move-result";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { ElementalType } from "#enums/elemental-type";

describe("Moves - Instruct", () => {
  let phaserGame: Phaser.Game;
  let game: GameManager;

  function instructSuccess(pokemon: Pokemon, moveId: MoveId): void {
    expect(pokemon.getLastXMoves(-1)[0].move.id).toBe(moveId);
    expect(pokemon.getLastXMoves(-1)[1].move.id).toBe(pokemon.getLastXMoves()[0].move.id);
    expect(pokemon.getMoveset().find((m) => m?.moveId === moveId)?.ppUsed).toBe(2);
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
    game.override
      .battleType("single")
      .enemySpecies(SpeciesId.SHUCKLE)
      .enemyAbility(AbilityId.NO_GUARD)
      .enemyLevel(100)
      .startingLevel(100)
      .ability(AbilityId.BALL_FETCH)
      .moveset([MoveId.INSTRUCT, MoveId.SONIC_BOOM, MoveId.SPLASH, MoveId.TORMENT])
      .disableCrits();
  });

  it("should repeat enemy's attack move when moving last", async () => {
    await game.classicMode.startBattle([SpeciesId.AMOONGUSS]);

    const enemy = game.scene.getEnemyPokemon()!;
    game.move.changeMoveset(enemy, MoveId.SONIC_BOOM);

    game.move.select(MoveId.INSTRUCT, BattlerIndex.PLAYER, BattlerIndex.ENEMY);
    await game.move.forceEnemyMove(MoveId.SONIC_BOOM, BattlerIndex.PLAYER);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    expect(game.scene.getPlayerPokemon()?.getInverseHp()).toBe(40);
    instructSuccess(enemy, MoveId.SONIC_BOOM);
  });

  it("should repeat enemy's move through substitute", async () => {
    await game.classicMode.startBattle([SpeciesId.AMOONGUSS]);

    const enemy = game.scene.getEnemyPokemon()!;
    game.move.changeMoveset(enemy, [MoveId.SONIC_BOOM, MoveId.SUBSTITUTE]);

    game.move.select(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SUBSTITUTE);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toNextTurn();

    game.move.select(MoveId.INSTRUCT);
    await game.move.forceEnemyMove(MoveId.SONIC_BOOM);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    expect(game.scene.getPlayerPokemon()?.getInverseHp()).toBe(40);
    instructSuccess(game.scene.getEnemyPokemon()!, MoveId.SONIC_BOOM);
  });

  it("should repeat ally's attack on enemy", async () => {
    game.override.battleType("double").moveset([]);
    await game.classicMode.startBattle([SpeciesId.AMOONGUSS, SpeciesId.SHUCKLE]);

    const [amoonguss, shuckle] = game.scene.getPlayerField();
    game.move.changeMoveset(amoonguss, MoveId.INSTRUCT);
    game.move.changeMoveset(shuckle, MoveId.SONIC_BOOM);

    game.move.select(MoveId.INSTRUCT, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2);
    game.move.select(MoveId.SONIC_BOOM, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.PLAYER_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.toEndOfTurn();

    expect(game.scene.getEnemyField()[0].getInverseHp()).toBe(40);
    instructSuccess(shuckle, MoveId.SONIC_BOOM);
  });

  // TODO: Enable test case once gigaton hammer (and blood moon) is fixed
  it.todo("should repeat enemy's Gigaton Hammer", async () => {
    game.override.enemyLevel(5);
    await game.classicMode.startBattle([SpeciesId.AMOONGUSS]);

    const enemy = game.scene.getEnemyPokemon()!;
    game.move.changeMoveset(enemy, MoveId.GIGATON_HAMMER);

    game.move.select(MoveId.INSTRUCT);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    instructSuccess(enemy, MoveId.GIGATON_HAMMER);
  });

  it("should respect enemy's status condition", async () => {
    game.override.moveset([MoveId.THUNDER_WAVE, MoveId.INSTRUCT]).enemyMoveset([MoveId.SPLASH, MoveId.SONIC_BOOM]);
    await game.classicMode.startBattle([SpeciesId.AMOONGUSS]);

    game.move.select(MoveId.THUNDER_WAVE);
    await game.move.selectEnemyMove(MoveId.SONIC_BOOM);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    game.move.select(MoveId.INSTRUCT);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.move.forceStatusActivation(true);
    await game.phaseInterceptor.to("MovePhase");
    await game.move.forceStatusActivation(false);
    await game.toEndOfTurn();

    const moveHistory = game.scene.getEnemyPokemon()!.getMoveHistory();
    expect(moveHistory.length).toBe(3);
    expect(moveHistory[0].move.id).toBe(MoveId.SONIC_BOOM);
    expect(moveHistory[1].move.id).toBe(MoveId.NONE);
    expect(moveHistory[2].move.id).toBe(MoveId.SONIC_BOOM);
  });

  it("should not repeat enemy's out of pp move", async () => {
    game.override.enemySpecies(SpeciesId.UNOWN);
    await game.classicMode.startBattle([SpeciesId.AMOONGUSS]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    game.move.changeMoveset(enemyPokemon, MoveId.HIDDEN_POWER);
    const moveUsed = enemyPokemon.moveset.find((m) => m?.moveId === MoveId.HIDDEN_POWER)!;
    moveUsed.ppUsed = moveUsed.getMovePp() - 1;

    game.move.select(MoveId.INSTRUCT);
    await game.move.selectEnemyMove(MoveId.HIDDEN_POWER);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    const playerMove = game.scene.getPlayerPokemon()!.getLastXMoves()!;
    expect(playerMove[0].result).toBe(MoveResult.FAIL);
    expect(enemyPokemon.getMoveHistory().length).toBe(1);
  });

  it("should fail if no move has yet been used by target", async () => {
    game.override.enemyMoveset(MoveId.SPLASH);
    await game.classicMode.startBattle([SpeciesId.AMOONGUSS]);

    game.move.select(MoveId.INSTRUCT);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toEndOfTurn();

    expect(game.scene.getPlayerPokemon()!.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });

  it("should attempt to call enemy's disabled move, but move use itself should fail", async () => {
    game.override.moveset([MoveId.INSTRUCT, MoveId.DISABLE]).battleType("double");
    await game.classicMode.startBattle([SpeciesId.AMOONGUSS, SpeciesId.DROWZEE]);

    const [enemy1, enemy2] = game.scene.getEnemyField();
    game.move.changeMoveset(enemy1, MoveId.SONIC_BOOM);
    game.move.changeMoveset(enemy2, MoveId.SPLASH);

    game.move.select(MoveId.INSTRUCT, BattlerIndex.PLAYER, BattlerIndex.ENEMY);
    game.move.select(MoveId.DISABLE, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY);
    await game.move.forceEnemyMove(MoveId.SONIC_BOOM, BattlerIndex.PLAYER);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY_2]);
    await game.toEndOfTurn();

    expect(game.scene.getPlayerField()[0].getLastXMoves()[0].result).toBe(MoveResult.SUCCESS);
    const enemyMove = game.scene.getEnemyPokemon()!.getLastXMoves()[0];
    expect(enemyMove.result).toBe(MoveResult.FAIL);
    expect(
      game.scene
        .getEnemyPokemon()!
        .getMoveset()
        .find((m) => m?.moveId === MoveId.SONIC_BOOM)?.ppUsed,
    ).toBe(1);
  });

  it("should not repeat enemy's move through protect", async () => {
    await game.classicMode.startBattle([SpeciesId.AMOONGUSS]);

    const MoveToUse = MoveId.PROTECT;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    game.move.changeMoveset(enemyPokemon, MoveToUse);
    game.move.select(MoveId.INSTRUCT);
    await game.move.forceEnemyMove(MoveId.PROTECT);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    expect(enemyPokemon.getLastXMoves(-1)[0].move.id).toBe(MoveId.PROTECT);
    expect(enemyPokemon.getLastXMoves(-1)[1]).toBeUndefined(); // undefined because protect failed
    expect(enemyPokemon.getMoveset().find((m) => m?.moveId === MoveId.PROTECT)?.ppUsed).toBe(1);
  });

  it("should not repeat enemy's charging move", async () => {
    game.override.enemyMoveset([MoveId.SONIC_BOOM, MoveId.HYPER_BEAM]).enemyLevel(5);
    await game.classicMode.startBattle([SpeciesId.SHUCKLE]);

    const player = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    enemyPokemon.battleSummonData.moveHistory = [
      {
        move: expect.objectContaining({ id: MoveId.SONIC_BOOM }),
        targets: [BattlerIndex.PLAYER],
        result: MoveResult.SUCCESS,
        type: ElementalType.NORMAL,
        virtual: false,
      },
    ];

    game.move.select(MoveId.INSTRUCT);
    await game.move.selectEnemyMove(MoveId.HYPER_BEAM);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(player.getLastXMoves()[0].result).toBe(MoveResult.FAIL);

    game.move.select(MoveId.INSTRUCT);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    expect(player.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });

  it("should not repeat dance move not known by target", async () => {
    game.override
      .battleType("double")
      .moveset([MoveId.INSTRUCT, MoveId.FIERY_DANCE])
      .enemyMoveset(MoveId.SPLASH)
      .enemyAbility(AbilityId.DANCER);
    await game.classicMode.startBattle([SpeciesId.SHUCKLE, SpeciesId.SHUCKLE]);

    game.move.select(MoveId.INSTRUCT, BattlerIndex.PLAYER, BattlerIndex.ENEMY);
    game.move.select(MoveId.FIERY_DANCE, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.PLAYER_2, BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.toEndOfTurn();

    expect(game.scene.getPlayerField()[0].getLastXMoves()[0].result).toBe(MoveResult.FAIL);
  });

  it("should cause multi-hit moves to hit the appropriate number of times in singles", async () => {
    game.override.enemyAbility(AbilityId.SKILL_LINK).enemyMoveset(MoveId.BULLET_SEED);
    await game.classicMode.startBattle([SpeciesId.BULBASAUR]);

    const player = game.scene.getPlayerPokemon()!;

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    game.move.select(MoveId.INSTRUCT);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toEndOfTurn();

    expect(player.turnData.attacksReceived.length).toBe(10);

    await game.toNextTurn();
    game.move.select(MoveId.INSTRUCT);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    expect(player.turnData.attacksReceived.length).toBe(10);
  });

  it("should cause multi-hit moves to hit the appropriate number of times in doubles", async () => {
    game.override
      .battleType("double")
      .enemyAbility(AbilityId.SKILL_LINK)
      .enemyMoveset([MoveId.BULLET_SEED, MoveId.SPLASH])
      .enemyLevel(5);
    await game.classicMode.startBattle([SpeciesId.BULBASAUR, SpeciesId.IVYSAUR]);

    const [, ivysaur] = game.scene.getPlayerField();

    game.move.select(MoveId.SPLASH);
    game.move.select(MoveId.SPLASH, 1);
    await game.move.selectEnemyMove(MoveId.BULLET_SEED, BattlerIndex.PLAYER_2);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    game.move.select(MoveId.INSTRUCT, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.INSTRUCT, 1, BattlerIndex.ENEMY);
    await game.move.selectEnemyMove(MoveId.BULLET_SEED, BattlerIndex.PLAYER_2);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    await game.toEndOfTurn();

    expect(ivysaur.turnData.attacksReceived.length).toBe(15);

    await game.toNextTurn();
    game.move.select(MoveId.INSTRUCT, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.INSTRUCT, 1, BattlerIndex.ENEMY);
    await game.move.selectEnemyMove(MoveId.BULLET_SEED, BattlerIndex.PLAYER_2);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);
    await game.toEndOfTurn();

    expect(ivysaur.turnData.attacksReceived.length).toBe(15);
  });
});
