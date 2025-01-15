import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
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
    game.override.enemySpecies(Species.REGIELEKI);
    game.override.enemyAbility(Abilities.STALL);
    game.override.enemyMoveset(Moves.QUICK_ATTACK);
    game.override.moveset([Moves.QUICK_ATTACK, Moves.TACKLE]);
  });

  const getTurnOrder = () => {
    return game.scene
      .getField(true)
      .sort((a, b) => a.turnData.order - b.turnData.order)
      .map((p) => p.getBattlerIndex());
  };

  /**
   * References:
   * https://bulbapedia.bulbagarden.net/wiki/Stall_(Ability)
   * https://bulbapedia.bulbagarden.net/wiki/Priority
   **/

  it("should cause the source to move last in its priority bracket", async () => {
    await game.classicMode.startBattle([Species.SHUCKLE]);

    game.move.select(Moves.QUICK_ATTACK);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(getTurnOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
  }, 20000);

  it("should not cause the source to move after moves in a lower priority bracket", async () => {
    await game.classicMode.startBattle([Species.SHUCKLE]);

    game.move.select(Moves.TACKLE);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(getTurnOrder()).toEqual([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
  }, 20000);

  it("multiple Pokemon with Stall should execute moves in speed order", async () => {
    game.override.ability(Abilities.STALL);
    await game.classicMode.startBattle([Species.SHUCKLE]);

    game.move.select(Moves.QUICK_ATTACK);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(getTurnOrder()).toEqual([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
  }, 20000);
});
