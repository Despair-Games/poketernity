import { BattlerIndex } from "#enums/battler-index";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Fur Coat", () => {
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
      .moveset([MoveId.TACKLE, MoveId.PSYSHOCK, MoveId.SWEET_KISS, MoveId.SPLASH])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.FUR_COAT)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should double the ability holder's defense", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat");
    game.move.select(MoveId.TACKLE);
    await game.toEndOfTurn();

    expect(enemyPokemon.getEffectiveStat).toHaveReturnedWith(enemyPokemon.stats[Stat.DEF] * 2);
  });

  it("should double the ability holder's defense when a special move uses its target's defense stat to calculate damage", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat");
    game.move.select(MoveId.PSYSHOCK);
    await game.toEndOfTurn();

    expect(enemyPokemon.getEffectiveStat).toHaveReturnedWith(enemyPokemon.getStat(Stat.DEF) * 2);
  });

  it("should not affect self-inflicted confusion damage", async () => {
    game.override.statusActivation(true);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat");

    game.move.select(MoveId.SWEET_KISS);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceHit();
    await game.toEndOfTurn();

    expect(enemyPokemon.getEffectiveStat).toHaveReturnedWith(enemyPokemon.getStat(Stat.DEF));
  });

  it("should not affect the Defense stat when using the move Body Press", async () => {
    game.override.enemyMoveset(MoveId.BODY_PRESS);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat");

    game.move.select(MoveId.SPLASH);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceHit();
    await game.toEndOfTurn();

    expect(enemyPokemon.getEffectiveStat).toHaveReturnedWith(enemyPokemon.getStat(Stat.DEF));
  });
});
