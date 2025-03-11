import { StatusEffect } from "#enums/status-effect";
import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Moves - Psycho Shift", () => {
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
      .moveset([MoveId.PSYCHO_SHIFT])
      .ability(Abilities.BALL_FETCH)
      .statusEffect(StatusEffect.POISON)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyLevel(20)
      .enemyAbility(Abilities.SYNCHRONIZE)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("If Psycho Shift is used on a Pokémon with Synchronize, the user of Psycho Shift will already be afflicted with a status condition when Synchronize activates", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.field.getPlayerPokemon();
    const enemyPokemon = game.field.getEnemyPokemon();
    expect(enemyPokemon.getStatusEffect()).toBe(StatusEffect.NONE);

    game.move.select(MoveId.PSYCHO_SHIFT);
    await game.toEndOfTurn();
    expect(playerPokemon.getStatusEffect()).toBe(StatusEffect.NONE);
    expect(enemyPokemon.getStatusEffect()).toBe(StatusEffect.POISON);
  });
});
