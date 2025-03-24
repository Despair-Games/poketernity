import { allMoves } from "#app/data/data-lists";
import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { BattlerTagType } from "#enums/battler-tag-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
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
      .ability(AbilityId.NO_GUARD)
      .enemySpecies(SpeciesId.AGGRON)
      .enemyAbility(AbilityId.BALL_FETCH)
      .startingLevel(100)
      .enemyLevel(100)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should double its power on sequential uses for up to 5 uses", async () => {
    const moveObj = allMoves.get(MoveId.ROLLOUT);
    const spy = vi.spyOn(moveObj, "calculateBattlePower");

    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    for (let i = 0; i < 7; i++) {
      game.move.use(MoveId.ROLLOUT);
      await game.toNextTurn();
    }

    const powerResults = spy.mock.results.map((result) => result.value);
    expect(powerResults).toStrictEqual([30, 60, 120, 240, 480, 30, 60]);
  });

  it("should double its power if the user previously used Defense Curl", async () => {
    const moveObj = allMoves.get(MoveId.ROLLOUT);
    vi.spyOn(moveObj, "calculateBattlePower");

    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    game.move.use(MoveId.DEFENSE_CURL);
    await game.toNextTurn();

    game.move.use(MoveId.ROLLOUT);
    await game.toNextTurn();

    expect(moveObj.calculateBattlePower).toHaveLastReturnedWith(60);
  });

  it("should lock the user into the move for 5 turns", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.ROLLOUT);
    await game.toNextTurn();

    // For the next 4 turns, check that the move is queued automatically
    // and that the move-locking tag's data is updated correctly
    for (let i = 0; i < 4; i++) {
      expect(player.getTag(BattlerTagType.ROLLING)?.turnCount).toBe(4 - i);
      expect(player.getMoveQueue()[0]).toMatchObject({
        move: expect.objectContaining({ id: MoveId.ROLLOUT }),
        ignorePP: true,
      });

      await game.toNextTurn();
    }

    // The move-locking tag should be removed after the move fully executes
    expect(player.getTag(BattlerTagType.ROLLING)).toBeUndefined();
    expect(player.getMoveQueue()).toHaveLength(0);
  });

  it("should stop its execution if an attack is unsuccessful", async () => {
    game.override.ability(AbilityId.BALL_FETCH);

    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();

    game.move.use(MoveId.ROLLOUT);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceHit();

    await game.toNextTurn();

    expect(player.getTag(BattlerTagType.ROLLING)).toBeDefined();
    expect(player.getMoveQueue()[0]?.move.id).toBe(MoveId.ROLLOUT);

    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceMiss();

    await game.toNextTurn();

    expect(player.getTag(BattlerTagType.ROLLING)).toBeUndefined();
    expect(player.getMoveQueue()).toHaveLength(0);
  });
});
