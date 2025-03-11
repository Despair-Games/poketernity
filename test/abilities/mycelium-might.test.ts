import { GameManager } from "#test/testUtils/gameManager";
import { Abilities } from "#enums/abilities";
import { Stat } from "#enums/stat";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { BattlerIndex } from "#enums/battler-index";

describe("Abilities - Mycelium Might", () => {
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
    game.override.enemySpecies(Species.SHUCKLE);
    game.override.enemyAbility(Abilities.CLEAR_BODY);
    game.override.enemyMoveset(MoveId.QUICK_ATTACK);
    game.override.ability(Abilities.MYCELIUM_MIGHT);
    game.override.moveset([MoveId.QUICK_ATTACK, MoveId.BABY_DOLL_EYES]);
  });

  /**
   * References:
   * https://bulbapedia.bulbagarden.net/wiki/Mycelium_Might_(Ability)
   * https://bulbapedia.bulbagarden.net/wiki/Priority
   * https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/page-24
   **/

  it("should make the source move last in its priority bracket and ignore protective abilities when using a status move", async () => {
    await game.classicMode.startBattle([Species.REGIELEKI]);

    const enemyPokemon = game.scene.getEnemyPokemon();

    game.move.select(MoveId.BABY_DOLL_EYES);

    await game.toEndOfTurn();

    expect(game.field.getTurnOrder()).toEqual([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    expect(game.field.getTurnOrder()).not.toEqual(game.field.getSpeedOrder());
    expect(enemyPokemon?.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should still go first if a status move that is in a higher priority bracket than the opponent's move is used", async () => {
    game.override.enemyMoveset(MoveId.TACKLE);
    await game.classicMode.startBattle([Species.REGIELEKI]);

    const enemyPokemon = game.scene.getEnemyPokemon();

    game.move.select(MoveId.BABY_DOLL_EYES);

    await game.toEndOfTurn();

    expect(game.field.getTurnOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    expect(enemyPokemon?.getStatStage(Stat.ATK)).toBe(-1);
  });

  it("should not affect non-status moves", async () => {
    await game.classicMode.startBattle([Species.REGIELEKI]);

    game.move.select(MoveId.QUICK_ATTACK);

    await game.toEndOfTurn();

    expect(game.field.getTurnOrder()).toEqual(game.field.getSpeedOrder());
    expect(game.field.getTurnOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
  });
});
