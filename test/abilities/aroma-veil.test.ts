import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { AbilityId } from "#enums/ability-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { BattlerTagType } from "#enums/battler-tag-type";
import { BattlerIndex } from "#enums/battler-index";
import { MoveResult } from "#enums/move-result";

describe("Moves - Aroma Veil", () => {
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
      .battleType("double")
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset([MoveId.HEAL_BLOCK, MoveId.IMPRISON, MoveId.SPLASH])
      .enemySpecies(SpeciesId.SHUCKLE)
      .ability(AbilityId.AROMA_VEIL)
      .moveset(MoveId.SPLASH);
  });

  it("Aroma Veil protects the Pokemon's side against most Move Restriction Battler Tags", async () => {
    await game.classicMode.startBattle([SpeciesId.REGIELEKI, SpeciesId.BULBASAUR]);

    const playerPokemon = game.scene.getPlayerField();

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);
    game.move.use(MoveId.ABSORB, 0, BattlerIndex.ENEMY);
    game.move.use(MoveId.ABSORB, 1, BattlerIndex.ENEMY_2);
    await game.move.selectEnemyMove(MoveId.HEAL_BLOCK);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toNextTurn();

    playerPokemon.forEach((p) => {
      expect(p.getTag(BattlerTagType.HEAL_BLOCK)).toBeUndefined();
      expect(p.getLastXMoves()[0]?.result).toBe(MoveResult.SUCCESS);
    });
  });

  it("Aroma Veil does not protect against Imprison", async () => {
    await game.classicMode.startBattle([SpeciesId.MAGIKARP, SpeciesId.FEEBAS]);

    const playerPokemon = game.scene.getPlayerField();

    game.move.select(MoveId.SPLASH);
    game.move.select(MoveId.SPLASH);
    await game.move.selectEnemyMove(MoveId.IMPRISON);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);
    await game.toNextTurn();

    playerPokemon.forEach((p) => expect(p.getLastXMoves()[0]?.result).toBe(MoveResult.FAIL));
  });
});
