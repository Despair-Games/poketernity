import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { MoveResult } from "#enums/move-result";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import type { TurnMove } from "#types/move-types";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Disable", () => {
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

  beforeEach(async () => {
    game = new GameManager(phaserGame);
    game.override
      .battleType("single")
      .ability(AbilityId.BALL_FETCH)
      .enemyAbility(AbilityId.BALL_FETCH)
      .moveset([MoveId.DISABLE, MoveId.SPLASH, MoveId.CELEBRATE])
      .enemyMoveset(MoveId.SPLASH)
      .enemySpecies(SpeciesId.SHUCKLE);
  });

  it("should restrict the target's last used move, and only that move", async () => {
    game.override.battleType("double");

    await game.classicMode.startBattle(SpeciesId.MAGIKARP, SpeciesId.FEEBAS);

    game.move.select(MoveId.SPLASH, 0);
    game.move.select(MoveId.SPLASH, 1);
    await game.toNextTurn();

    game.move.select(MoveId.CELEBRATE, 0);
    game.move.select(MoveId.CELEBRATE, 1);
    await game.toNextTurn();

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.PLAYER_2, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2]);
    game.move.select(MoveId.DISABLE, 0, BattlerIndex.PLAYER_2);
    game.move.select(MoveId.SPLASH, 1);
    await game.toEndOfTurn();

    const [, player2] = game.scene.getPlayerField();

    expect(player2.isMoveRestricted(MoveId.CELEBRATE)).toBeTruthy();
    expect(player2.isMoveRestricted(MoveId.SPLASH)).toBeFalsy();
  });

  it("should restrict the move used by the target on the same turn", async () => {
    await game.classicMode.startBattle(SpeciesId.PIKACHU);

    const enemy = game.field.getEnemyPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    game.move.select(MoveId.DISABLE);
    await game.toNextTurn();

    expect(enemy.getMoveHistory()).toHaveLength(1);
    expect(enemy.isMoveRestricted(MoveId.SPLASH)).toBeTruthy();
  });

  it("should fail if enemy has no move history", async () => {
    await game.classicMode.startBattle(SpeciesId.PIKACHU);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    game.move.select(MoveId.DISABLE);
    await game.toNextTurn();

    expect(player.getMoveHistory()[0]).toMatchObject<TurnMove>({
      move: expect.objectContaining({ id: MoveId.DISABLE }),
      result: MoveResult.FAIL,
      type: ElementalType.NORMAL,
      targets: [2],
    });
    expect(enemy.isMoveRestricted(MoveId.SPLASH)).toBeFalsy();
  }, 20000);

  it("should force the target to use Struggle if all usable moves are disabled", async () => {
    await game.classicMode.startBattle(SpeciesId.PIKACHU);

    const enemy = game.field.getEnemyPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    game.move.select(MoveId.DISABLE);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    const enemyHistory = enemy.getMoveHistory();
    expect(enemyHistory).toHaveLength(2);
    expect(enemyHistory[0].move.id).toBe(MoveId.SPLASH);
    expect(enemyHistory[1].move.id).toBe(MoveId.STRUGGLE);
  }, 20000);

  it("should fail if the target's last move was Struggle", async () => {
    game.override.enemyMoveset([MoveId.STRUGGLE]);
    await game.classicMode.startBattle(SpeciesId.PIKACHU);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    game.move.select(MoveId.DISABLE);
    await game.toNextTurn();

    expect(player).toHaveMoveResult(MoveResult.FAIL);
    expect(enemy).toHaveUsedMove(MoveId.STRUGGLE);
    expect(enemy.isMoveRestricted(MoveId.STRUGGLE)).toBeFalsy();
  }, 20000);

  it("should interrupt the target's move if it matches the disabled move", async () => {
    await game.classicMode.startBattle(SpeciesId.PIKACHU);

    const enemy = game.field.getEnemyPokemon();

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    // Both mons just used Splash last turn; now have player use Disable.
    game.move.select(MoveId.DISABLE);
    await game.toNextTurn();

    const enemyHistory = enemy.getMoveHistory();
    expect(enemyHistory).toHaveLength(2);
    expect(enemyHistory[0]).toMatchObject<TurnMove>({
      move: expect.objectContaining({ id: MoveId.SPLASH }),
      result: MoveResult.SUCCESS,
      type: ElementalType.NORMAL,
      targets: [2],
    });
    expect(enemyHistory[1].result).toBe(MoveResult.FAIL);
  }, 20000);

  it("should disable Nature Power, not the move invoked by it", async () => {
    game.override.enemyMoveset([MoveId.NATURE_POWER]);
    await game.classicMode.startBattle(SpeciesId.PIKACHU);

    const enemy = game.field.getEnemyPokemon();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    game.move.select(MoveId.DISABLE);
    await game.toNextTurn();

    expect(enemy.isMoveRestricted(MoveId.NATURE_POWER)).toBeTruthy();
  }, 20000);
});
