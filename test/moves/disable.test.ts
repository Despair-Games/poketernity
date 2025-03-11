import { BattlerIndex } from "#enums/battler-index";
import { MoveResult } from "#enums/move-result";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { TurnMove } from "#app/@types/TurnMove";
import { ElementalType } from "#enums/elemental-type";

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
      .ability(Abilities.BALL_FETCH)
      .enemyAbility(Abilities.BALL_FETCH)
      .moveset([MoveId.DISABLE, MoveId.SPLASH])
      .enemyMoveset(MoveId.SPLASH)
      .starterSpecies(Species.PIKACHU)
      .enemySpecies(Species.SHUCKLE);
  });

  it("restricts moves", async () => {
    await game.classicMode.startBattle();

    const enemyMon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.DISABLE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemyMon.getMoveHistory()).toHaveLength(1);
    expect(enemyMon.isMoveRestricted(MoveId.SPLASH)).toBe(true);
  });

  it("fails if enemy has no move history", async () => {
    await game.classicMode.startBattle();

    const playerMon = game.scene.getPlayerPokemon()!;
    const enemyMon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.DISABLE);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toNextTurn();

    expect(playerMon.getMoveHistory()[0]).toMatchObject<TurnMove>({
      move: expect.objectContaining({ id: MoveId.DISABLE }),
      result: MoveResult.FAIL,
      type: ElementalType.NORMAL,
      targets: [2],
    });
    expect(enemyMon.isMoveRestricted(MoveId.SPLASH)).toBe(false);
  }, 20000);

  it("causes STRUGGLE if all usable moves are disabled", async () => {
    await game.classicMode.startBattle();

    const enemyMon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.DISABLE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    const enemyHistory = enemyMon.getMoveHistory();
    expect(enemyHistory).toHaveLength(2);
    expect(enemyHistory[0].move.id).toBe(MoveId.SPLASH);
    expect(enemyHistory[1].move.id).toBe(MoveId.STRUGGLE);
  }, 20000);

  it("cannot disable STRUGGLE", async () => {
    game.override.enemyMoveset([MoveId.STRUGGLE]);
    await game.classicMode.startBattle();

    const playerMon = game.scene.getPlayerPokemon()!;
    const enemyMon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.DISABLE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(playerMon.getLastXMoves()[0].result).toBe(MoveResult.FAIL);
    expect(enemyMon.getLastXMoves()[0].move.id).toBe(MoveId.STRUGGLE);
    expect(enemyMon.isMoveRestricted(MoveId.STRUGGLE)).toBe(false);
  }, 20000);

  it("interrupts target's move when target moves after", async () => {
    await game.classicMode.startBattle();

    const enemyMon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.SPLASH);
    await game.toNextTurn();

    // Both mons just used Splash last turn; now have player use Disable.
    game.move.select(MoveId.DISABLE);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.toNextTurn();

    const enemyHistory = enemyMon.getMoveHistory();
    expect(enemyHistory).toHaveLength(2);
    expect(enemyHistory[0]).toMatchObject<TurnMove>({
      move: expect.objectContaining({ id: MoveId.SPLASH }),
      result: MoveResult.SUCCESS,
      type: ElementalType.NORMAL,
      targets: [2],
    });
    expect(enemyHistory[1].result).toBe(MoveResult.FAIL);
  }, 20000);

  it("disables NATURE POWER, not the move invoked by it", async () => {
    game.override.enemyMoveset([MoveId.NATURE_POWER]);
    await game.classicMode.startBattle();

    const enemyMon = game.scene.getEnemyPokemon()!;

    game.move.select(MoveId.DISABLE);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toNextTurn();

    expect(enemyMon.isMoveRestricted(MoveId.NATURE_POWER)).toBe(true);
    expect(enemyMon.isMoveRestricted(enemyMon.getLastXMoves(2)[1].move.id)).toBe(false);
  }, 20000);
});
