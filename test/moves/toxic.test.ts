import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { StatusEffect } from "#enums/status-effect";
import { BattlerIndex } from "#app/battle";
import { allMoves } from "#app/data/all-moves";

describe("Moves - Toxic", () => {
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
      .battleType("single")
      .moveset(Moves.TOXIC)
      .enemySpecies(Species.MAGIKARP)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should be guaranteed to hit if user is Poison-type", async () => {
    vi.spyOn(allMoves[Moves.TOXIC], "accuracy", "get").mockReturnValue(0);
    await game.classicModeHelper.startBattle([Species.TOXAPEX]);

    game.moveHelper.select(Moves.TOXIC);
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(game.scene.getEnemyPokemon()!.status?.effect).toBe(StatusEffect.TOXIC);
  });

  it("may miss if user is not Poison-type", async () => {
    vi.spyOn(allMoves[Moves.TOXIC], "accuracy", "get").mockReturnValue(0);
    await game.classicModeHelper.startBattle([Species.UMBREON]);

    game.moveHelper.select(Moves.TOXIC);
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(game.scene.getEnemyPokemon()!.status).toBeUndefined();
  });

  it("should hit semi-invulnerable targets if user is Poison-type", async () => {
    vi.spyOn(allMoves[Moves.TOXIC], "accuracy", "get").mockReturnValue(0);
    game.overridesHelper.enemyMoveset(Moves.FLY);
    await game.classicModeHelper.startBattle([Species.TOXAPEX]);

    game.moveHelper.select(Moves.TOXIC);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(game.scene.getEnemyPokemon()!.status?.effect).toBe(StatusEffect.TOXIC);
  });

  it("should miss semi-invulnerable targets if user is not Poison-type", async () => {
    vi.spyOn(allMoves[Moves.TOXIC], "accuracy", "get").mockReturnValue(-1);
    game.overridesHelper.enemyMoveset(Moves.FLY);
    await game.classicModeHelper.startBattle([Species.UMBREON]);

    game.moveHelper.select(Moves.TOXIC);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(game.scene.getEnemyPokemon()!.status).toBeUndefined();
  });

  it("moves other than Toxic should not hit semi-invulnerable targets even if user is Poison-type", async () => {
    game.overridesHelper.moveset(Moves.SWIFT);
    game.overridesHelper.enemyMoveset(Moves.FLY);
    await game.classicModeHelper.startBattle([Species.TOXAPEX]);

    game.moveHelper.select(Moves.SWIFT);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("BerryPhase", false);

    const enemyPokemon = game.scene.getEnemyPokemon()!;
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
  });
});
