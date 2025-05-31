import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import type { EnemyPokemon } from "#field/enemy-pokemon";
import type { PlayerPokemon } from "#field/player-pokemon";
import { GameManager } from "#test/test-utils/game-manager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";

describe("Moves - Purify", () => {
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
      .battleType("single")
      .startingLevel(10)
      .moveset([MoveId.PURIFY, MoveId.SIZZLY_SLIDE])
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyLevel(10)
      .enemyMoveset(MoveId.SPLASH);
  });

  test("Purify heals opponent status effect and restores user hp", async () => {
    await game.classicMode.startBattle(SpeciesId.PYUKUMUKU);

    const enemyPokemon: EnemyPokemon = game.scene.getEnemyPokemon()!;
    const playerPokemon: PlayerPokemon = game.scene.getPlayerPokemon()!;

    playerPokemon.hp = playerPokemon.getMaxHp() - 1;
    enemyPokemon.trySetStatus(StatusEffect.BURN);
    expect(enemyPokemon).toHaveStatusEffect(StatusEffect.BURN);

    game.move.select(MoveId.PURIFY);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("PostActionPhase");

    expect(enemyPokemon.getStatusEffect()).toBe(StatusEffect.NONE);
    expect(playerPokemon.isFullHp()).toBe(true);
  });

  test("Purify does not heal if opponent doesnt have any status effect", async () => {
    await game.classicMode.startBattle(SpeciesId.PYUKUMUKU);

    const playerPokemon: PlayerPokemon = game.scene.getPlayerPokemon()!;

    playerPokemon.hp = playerPokemon.getMaxHp() - 1;
    const playerInitialHp = playerPokemon.hp;

    game.move.select(MoveId.PURIFY);
    game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.phaseInterceptor.to("PostActionPhase");

    expect(playerPokemon.hp).toBe(playerInitialHp);
  });
});
