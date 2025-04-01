import { BattlerIndex } from "#enums/battler-index";
import { getGameMode } from "#app/game-mode";
import { GameModes } from "#enums/game-modes";
import { BattleEndPhase } from "#app/phases/battle-end-phase";
import { TurnInitPhase } from "#app/phases/turn-init-phase";
import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

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
    game.override
      .battleType("double")
      .moveset(MoveId.SPLASH)
      .enemyMoveset(MoveId.SPLASH)
      .enemySpecies(SpeciesId.MAGIKARP)
      .ability(AbilityId.BALL_FETCH)
      .enemyAbility(AbilityId.BALL_FETCH);
  });

  // double-battle player's pokemon both fainted in same round, then revive one, and next double battle summons two player's pokemon successfully.
  // (There were bugs that either only summon one when can summon two, player stuck in switchPhase etc)
  it("3v2 edge case: player summons 2 pokemon on the next battle after being fainted and revived", async () => {
    await game.classicMode.startBattle([SpeciesId.BULBASAUR, SpeciesId.CHARIZARD, SpeciesId.SQUIRTLE]);

    game.move.select(MoveId.SPLASH);
    game.move.select(MoveId.SPLASH, 1);

    for (const pokemon of game.scene.getPlayerField()) {
      pokemon.faint();
      expect(pokemon.isFainted()).toBe(true);
    }

    await game.doKillOpponents();

    await game.phaseInterceptor.to(BattleEndPhase);
    game.doSelectModifier();

    const charizard = game.scene.getPlayerParty().findIndex((p) => p.species.speciesId === SpeciesId.CHARIZARD);
    game.doRevivePokemon(charizard);

    await game.phaseInterceptor.to(TurnInitPhase);
    expect(game.scene.getPlayerField().filter((p) => !p.isFainted())).toHaveLength(2);
  }, 20000);

  it("randomly chooses between single and double battles if there is no battle type override", async () => {
    game.override.battleType(null);

    await game.classicMode.startBattle([SpeciesId.BULBASAUR]);
    game.scene.gameMode = getGameMode(GameModes.ENDLESS);

    let doubleCount = 0;
    let singleCount = 0;

    // Play through endless, waves 1 to 9, counting number of double battles from waves 2 to 9
    await game.rng.equalSample(DOUBLE_CHANCE, async () => {
      game.move.select(MoveId.SPLASH);
      await game.doKillOpponents();
      await game.toNextWave();

      if (game.scene.getEnemyParty().length === 1) {
        singleCount++;
      } else if (game.scene.getEnemyParty().length === 2) {
        doubleCount++;
      }
    });

    expect(doubleCount).toBe(1);
    expect(singleCount).toBe(DOUBLE_CHANCE - 1);
  });

  it("shouldn't hit itself if ally dies before move", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MILOTIC]);

    const [, milotic] = game.scene.getPlayerField();

    game.move.select(MoveId.MEMENTO, 0, BattlerIndex.ENEMY);
    game.move.select(MoveId.SURF, 1);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY, BattlerIndex.ENEMY_2, BattlerIndex.PLAYER_2]);
    await game.toNextTurn();

    expect(milotic.isFullHp()).toBe(true);
  });
});
