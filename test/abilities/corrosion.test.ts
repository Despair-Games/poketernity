import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Corrosion", () => {
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
      .moveset([MoveId.SPLASH])
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.GRIMER)
      .enemyAbility(Abilities.CORROSION)
      .enemyMoveset(MoveId.TOXIC);
  });

  it("If a Poison- or Steel-type Pokémon with this Ability poisons a target with Synchronize, Synchronize does not gain the ability to poison Poison- or Steel-type Pokémon.", async () => {
    game.override.ability(Abilities.SYNCHRONIZE);
    await game.classicMode.startBattle([Species.FEEBAS]);

    const playerPokemon = game.field.getPlayerPokemon();
    const enemyPokemon = game.field.getEnemyPokemon();
    expect(playerPokemon.getStatusEffect()).toBe(StatusEffect.NONE);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();
    expect(playerPokemon.getStatusEffect()).toBe(StatusEffect.TOXIC);
    expect(enemyPokemon.getStatusEffect()).toBe(StatusEffect.NONE);
  });
});
