import { BattlerIndex } from "#app/battle";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
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
      .moveset([Moves.TACKLE, Moves.PSYSHOCK, Moves.SWEET_KISS, Moves.SPLASH])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.FUR_COAT)
      .enemyMoveset(Moves.SPLASH);
  });

  it("should double the ability holder's defense", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat");
    game.move.select(Moves.TACKLE);
    await game.phaseInterceptor.to("BerryPhase");

    expect(enemyPokemon.getEffectiveStat).toHaveReturnedWith(enemyPokemon.stats[Stat.DEF] * 2);
  });

  it("should double the ability holder's defense when a special move uses its target's defense stat to calculate damage", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat");
    game.move.select(Moves.PSYSHOCK);
    await game.phaseInterceptor.to("BerryPhase");

    expect(enemyPokemon.getEffectiveStat).toHaveReturnedWith(enemyPokemon.getStat(Stat.DEF) * 2);
  });

  it("should not affect self-inflicted confusion damage", async () => {
    game.override.statusActivation(true);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat");

    game.move.select(Moves.SWEET_KISS);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(enemyPokemon.getEffectiveStat).toHaveReturnedWith(enemyPokemon.getStat(Stat.DEF));
  });

  it("should not affect the Defense stat when using the move Body Press", async () => {
    game.override.enemyMoveset(Moves.BODY_PRESS);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const enemyPokemon = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemyPokemon, "getEffectiveStat");

    game.move.select(Moves.SPLASH);
    await game.setTurnOrder([BattlerIndex.PLAYER, BattlerIndex.ENEMY]);
    await game.move.forceHit();
    await game.phaseInterceptor.to("BerryPhase");

    expect(enemyPokemon.getEffectiveStat).toHaveReturnedWith(enemyPokemon.getStat(Stat.DEF));
  });
});
