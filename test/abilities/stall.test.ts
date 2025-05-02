import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { BattlerIndex } from "#enums/battler-index";

describe("Abilities - Stall", () => {
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
    game.override.battleType("single");
    game.override.disableCrits();
    game.override.enemySpecies(SpeciesId.REGIELEKI);
    game.override.enemyAbility(AbilityId.STALL);
    game.override.enemyMoveset(MoveId.QUICK_ATTACK);
    game.override.moveset([MoveId.QUICK_ATTACK, MoveId.TACKLE]);
  });

  /**
   * References:
   * https://bulbapedia.bulbagarden.net/wiki/Stall_(Ability)
   * https://bulbapedia.bulbagarden.net/wiki/Priority
   **/

  it("should cause the source to move last in its priority bracket", async () => {
    await game.classicMode.startBattle([SpeciesId.SHUCKLE]);

    game.move.select(MoveId.QUICK_ATTACK);

    await game.toEndOfTurn();

    expect(game.field.getTurnOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    expect(game.field.getTurnOrder()).not.toEqual(game.field.getSpeedOrder());
  });

  it("should not cause the source to move after moves in a lower priority bracket", async () => {
    await game.classicMode.startBattle([SpeciesId.SHUCKLE]);

    game.move.select(MoveId.TACKLE);

    await game.toEndOfTurn();

    expect(game.field.getTurnOrder()).toEqual([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
  });

  it("multiple Pokemon with Stall should execute moves in speed order", async () => {
    game.override.ability(AbilityId.STALL);
    await game.classicMode.startBattle([SpeciesId.SHUCKLE]);

    game.move.select(MoveId.QUICK_ATTACK);

    await game.toEndOfTurn();

    expect(game.field.getTurnOrder()).toEqual(game.field.getSpeedOrder());
    expect(game.field.getTurnOrder()).toEqual([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
  });
});
