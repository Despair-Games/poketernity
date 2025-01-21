import { BattlerIndex } from "#enums/battler-index";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
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
      .moveset([Moves.G_MAX_FOAM_BURST, Moves.G_MAX_TARTNESS, Moves.SPLASH])
      .enemySpecies(Species.HAPPINY)
      .enemyLevel(1)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH);
  });

  it.each([
    { gmaxMove: Moves.G_MAX_FOAM_BURST, statDropped: Stat.SPD, statChangeAmt: -2 },
    { gmaxMove: Moves.G_MAX_TARTNESS, statDropped: Stat.EVA, statChangeAmt: -1 },
  ])("G-Max moves should debuff both opponents", async ({ gmaxMove, statDropped, statChangeAmt }) => {
    await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

    game.move.select(gmaxMove, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.SPLASH, 1);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);
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
    game.override.enemyAbility(Abilities.PRANKSTER).enemyMoveset([Moves.SUBSTITUTE]);
    await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

    game.move.select(Moves.G_MAX_FOAM_BURST, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.SPLASH, 1);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);
    await game.phaseInterceptor.to("MoveEndPhase", false);

    const enemyParty = game.scene.getEnemyParty();
    await game.toNextTurn();
    enemyParty.forEach((pokemon) => {
      expect(pokemon.getStatStage(Stat.SPD)).toBe(-2);
    });
  });

  it("G-Max debuff moves should not drop stats through clear body", async () => {
    game.override.enemyAbility(Abilities.CLEAR_BODY).enemyMoveset([Moves.SUBSTITUTE]);
    await game.classicMode.startBattle([Species.SUNKERN, Species.SUNKERN]);

    game.move.select(Moves.G_MAX_FOAM_BURST, 0, BattlerIndex.ENEMY);
    game.move.select(Moves.SPLASH, 1);

    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER, BattlerIndex.PLAYER_2]);
    await game.phaseInterceptor.to("MoveEndPhase", false);

    const enemyParty = game.scene.getEnemyParty();
    await game.toNextTurn();
    enemyParty.forEach((pokemon) => {
      expect(pokemon.getStatStage(Stat.SPD)).toBe(0);
    });
  });
});
