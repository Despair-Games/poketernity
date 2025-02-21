import { allMoves } from "#app/data/data-lists";
import { Abilities } from "#enums/abilities";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Rollout", () => {
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
      .disableCrits()
      .battleType("single")
      .ability(Abilities.BALL_FETCH)
      .enemySpecies(Species.STAKATAKA)
      .enemyAbility(Abilities.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should double its power on sequential uses for up to 5 uses", async () => {
    const moveObj = allMoves[MoveId.ROLLOUT];
    vi.spyOn(moveObj, "accuracy", "get").mockReturnValue(100); //always hit
    const spy = vi.spyOn(moveObj, "calculateBattlePower");

    await game.classicMode.startBattle([Species.FEEBAS]);

    const powerResults: number[] = [];

    for (let i = 0; i < 6; i++) {
      game.move.use(MoveId.ROLLOUT);
      await game.toNextTurn();

      const lastReturnedPower = spy.mock.results.at(-1)?.value;
      if (lastReturnedPower) {
        powerResults.push(lastReturnedPower);
      }
    }

    expect(powerResults).toHaveLength(6);
    powerResults
      .slice(1, 5)
      .forEach((power, i) => expect(power).toBe(Math.floor(Math.pow(2, i + 1) * powerResults[0])));
    expect(powerResults[5]).toBe(powerResults[0]);
  });

  it("should lock the user into the move for 5 turns", async () => {
    vi.spyOn(allMoves[MoveId.ROLLOUT], "accuracy", "get").mockReturnValue(100);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.ROLLOUT);
    await game.toNextTurn();

    // For the next 4 turns, check that the move is queued automatically
    // and that the move-locking tag's data is updated correctly
    for (let i = 0; i < 4; i++) {
      expect(player.getTag(BattlerTagType.ROLLING)?.turnCount).toBe(4 - i);
      expect(player.getMoveQueue()[0]).toMatchObject({
        moveId: MoveId.ROLLOUT,
        ignorePP: true,
      });

      await game.toNextTurn();
    }

    // The move-locking tag should be removed after the move fully executes
    expect(player.getTag(BattlerTagType.ROLLING)).toBeUndefined();
    expect(player.getMoveQueue()).toHaveLength(0);
  });

  it("should stop its execution if an attack is unsuccessful", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.ROLLOUT);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceHit();

    await game.toNextTurn();

    expect(player.getTag(BattlerTagType.ROLLING)).toBeDefined();
    expect(player.getMoveQueue()[0]?.moveId).toBe(MoveId.ROLLOUT);

    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceMiss();

    await game.toNextTurn();

    expect(player.getTag(BattlerTagType.ROLLING)).toBeUndefined();
    expect(player.getMoveQueue()).toHaveLength(0);
  });
});
