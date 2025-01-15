import { GameManager } from "#test/testUtils/gameManager";
import { Abilities } from "#enums/abilities";
import { Stat } from "#enums/stat";
import { Moves } from "#enums/moves";
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
    game.override.enemyMoveset(Moves.QUICK_ATTACK);
    game.override.ability(Abilities.MYCELIUM_MIGHT);
    game.override.moveset([Moves.QUICK_ATTACK, Moves.BABY_DOLL_EYES]);
  });

  const getTurnOrder = () => {
    return game.scene
      .getField(true)
      .sort((a, b) => a.turnData.order - b.turnData.order)
      .map((p) => p.getBattlerIndex());
  };

  /**
   * References:
   * https://bulbapedia.bulbagarden.net/wiki/Mycelium_Might_(Ability)
   * https://bulbapedia.bulbagarden.net/wiki/Priority
   * https://www.smogon.com/forums/threads/scarlet-violet-battle-mechanics-research.3709545/page-24
   **/

  it("should make the source move last in its priority bracket and ignore protective abilities when using a status move", async () => {
    await game.classicMode.startBattle([Species.REGIELEKI]);

    const enemyPokemon = game.scene.getEnemyPokemon();

    game.move.select(Moves.BABY_DOLL_EYES);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(getTurnOrder()).toEqual([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    expect(enemyPokemon?.getStatStage(Stat.ATK)).toBe(-1);
  }, 20000);

  it("should still go first if a status move that is in a higher priority bracket than the opponent's move is used", async () => {
    game.override.enemyMoveset(Moves.TACKLE);
    await game.classicMode.startBattle([Species.REGIELEKI]);

    const enemyPokemon = game.scene.getEnemyPokemon();

    game.move.select(Moves.BABY_DOLL_EYES);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(getTurnOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    expect(enemyPokemon?.getStatStage(Stat.ATK)).toBe(-1);
  }, 20000);

  it("should not affect non-status moves", async () => {
    await game.classicMode.startBattle([Species.REGIELEKI]);

    game.move.select(Moves.QUICK_ATTACK);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(getTurnOrder()).toEqual([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
  }, 20000);
});
