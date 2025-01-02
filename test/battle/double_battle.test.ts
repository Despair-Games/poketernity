import { BattlerIndex } from "#app/battle";
import { Status } from "#app/data/status-effect";
import { GameModes, getGameMode } from "#app/game-mode";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { TurnInitPhase } from "#app/phases/turn-init-phase";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Double Battles", () => {
  const DOUBLE_CHANCE = 8; // Normal chance of double battle is 1/8

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
    game.overridesHelper
      .battleType("double")
      .moveset(Moves.SPLASH)
      .enemyMoveset(Moves.SPLASH)
      .enemySpecies(Species.MAGIKARP)
      .ability(Abilities.BALL_FETCH)
      .enemyAbility(Abilities.BALL_FETCH);
  });

  // double-battle player's pokemon both fainted in same round, then revive one, and next double battle summons two player's pokemon successfully.
  // (There were bugs that either only summon one when can summon two, player stuck in switchPhase etc)
  it("3v2 edge case: player summons 2 pokemon on the next battle after being fainted and revived", async () => {
    await game.classicModeHelper.startBattle([Species.BULBASAUR, Species.CHARIZARD, Species.SQUIRTLE]);

    game.moveHelper.select(Moves.SPLASH);
    game.moveHelper.select(Moves.SPLASH, 1);

    for (const pokemon of game.scene.getPlayerField()) {
      pokemon.hp = 0;
      pokemon.status = new Status(StatusEffect.FAINT);
      expect(pokemon.isFainted()).toBe(true);
    }

    await game.doKillOpponents();

    await game.phaseInterceptor.to(BattleEndPhase);
    game.doSelectModifier();

    const charizard = game.scene.getPlayerParty().findIndex((p) => p.species.speciesId === Species.CHARIZARD);
    game.doRevivePokemon(charizard);

    await game.phaseInterceptor.to(TurnInitPhase);
    expect(game.scene.getPlayerField().filter((p) => !p.isFainted())).toHaveLength(2);
  }, 20000);

  it("randomly chooses between single and double battles if there is no battle type override", async () => {
    let rngSweepProgress = 0; // Will simulate RNG rolls by slowly increasing from 0 to 1
    let doubleCount = 0;
    let singleCount = 0;

    vi.spyOn(Phaser.Math.RND, "realInRange").mockImplementation((min: number, max: number) => {
      return rngSweepProgress * (max - min) + min;
    });

    game.overridesHelper.battleType(null);

    // Play through endless, waves 1 to 9, counting number of double battles from waves 2 to 9
    await game.classicModeHelper.startBattle([Species.BULBASAUR]);
    game.scene.gameMode = getGameMode(GameModes.ENDLESS);

    for (let i = 0; i < DOUBLE_CHANCE; i++) {
      rngSweepProgress = (i + 0.5) / DOUBLE_CHANCE;

      game.moveHelper.select(Moves.SPLASH);
      await game.doKillOpponents();
      await game.toNextWave();

      if (game.scene.getEnemyParty().length === 1) {
        singleCount++;
      } else if (game.scene.getEnemyParty().length === 2) {
        doubleCount++;
      }
    }

    expect(doubleCount).toBe(1);
    expect(singleCount).toBe(DOUBLE_CHANCE - 1);
  });

  it("shouldn't hit itself if ally dies before move", async () => {
    await game.classicModeHelper.startBattle([Species.FEEBAS, Species.MILOTIC]);

    const [, milotic] = game.scene.getPlayerField();

    game.moveHelper.select(Moves.MEMENTO, 0, BattlerIndex.ENEMY);
    game.moveHelper.select(Moves.SURF, 1);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER_2]);
    await game.toNextTurn();

    expect(milotic.isFullHp()).toBe(true);
  });
});
