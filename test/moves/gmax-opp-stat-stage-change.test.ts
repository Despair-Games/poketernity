import { BattlerIndex } from "#enums/battler-index";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, it, expect } from "vitest";
import type { EffectiveStat } from "#enums/stat";
import { Stat } from "#enums/stat";

describe("Moves - G-Max debuff both opponents", () => {
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
      .startingLevel(100)
      .moveset([MoveId.G_MAX_FOAM_BURST, MoveId.G_MAX_TARTNESS, MoveId.SPLASH])
      .enemySpecies(Species.HAPPINY)
      .enemyLevel(1)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it.each([
    { gmaxMoveId: MoveId.G_MAX_FOAM_BURST, statDropped: Stat.SPD, statChangeAmt: -2 },
    { gmaxMoveId: MoveId.G_MAX_TARTNESS, statDropped: Stat.EVA, statChangeAmt: -1 },
  ])("G-Max moves should debuff both opponents", async ({ gmaxMoveId, statDropped, statChangeAmt }) => {
    await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

    game.move.select(gmaxMoveId, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);
    await game.phaseInterceptor.to("MoveEndPhase", false);

    const enemyParty = game.scene.getEnemyParty();
    await game.toNextTurn();

    enemyParty.forEach((pokemon) => {
      if (pokemon.isActive()) {
        expect(pokemon.getStatStage(statDropped as EffectiveStat)).toBe(statChangeAmt);
      }
    });
  });

  it("G-Max debuff moves should still drop stats through substitute", async () => {
    game.override.enemyAbility(Abilities.PRANKSTER).enemyMoveset([MoveId.SUBSTITUTE]);
    await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

    game.move.select(MoveId.G_MAX_FOAM_BURST, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);
    await game.phaseInterceptor.to("MoveEndPhase", false);

    const enemyParty = game.scene.getEnemyParty();
    await game.toNextTurn();
    enemyParty.forEach((pokemon) => {
      expect(pokemon.getStatStage(Stat.SPD)).toBe(-2);
    });
  });

  it("G-Max debuff moves should not drop stats through clear body", async () => {
    game.override.enemyAbility(Abilities.CLEAR_BODY).enemyMoveset([MoveId.SUBSTITUTE]);
    await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

    game.move.select(MoveId.G_MAX_FOAM_BURST, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SPLASH, 1);

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);
    await game.phaseInterceptor.to("MoveEndPhase", false);

    const enemyParty = game.scene.getEnemyParty();
    await game.toNextTurn();
    enemyParty.forEach((pokemon) => {
      expect(pokemon.getStatStage(Stat.SPD)).toBe(0);
    });
  });
});
