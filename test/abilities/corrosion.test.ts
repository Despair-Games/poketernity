import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
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
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.GRIMER)
      .enemyAbility(AbilityId.CORROSION)
      .enemyMoveset(MoveId.TOXIC);
  });

  it("allows the user to poison a Poison or Steel type pokemon", async () => {
    await game.classicMode.startBattle([SpeciesId.MUK]);

    const playerPokemon = game.field.getPlayerPokemon();
    const enemyPokemon = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();
    expect(playerPokemon.getStatusEffect()).toBe(StatusEffect.TOXIC);
    expect(enemyPokemon.getStatusEffect()).toBe(StatusEffect.NONE);
  });

  it("does not allow the user to get poisoned if the user is Poison or Steel type and poisons a target with Synchronize", async () => {
    game.override.ability(AbilityId.SYNCHRONIZE);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPokemon = game.field.getPlayerPokemon();
    const enemyPokemon = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();
    expect(playerPokemon.getStatusEffect()).toBe(StatusEffect.TOXIC);
    expect(enemyPokemon.getStatusEffect()).toBe(StatusEffect.NONE);
  });

  it("does not allow the user to get poisoned if the user is Poison or Steel type and poisons a target with Magic Bounce", async () => {
    game.override.ability(AbilityId.MAGIC_BOUNCE);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const playerPokemon = game.field.getPlayerPokemon();
    const enemyPokemon = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH);
    await game.toEndOfTurn();
    expect(playerPokemon.getStatusEffect()).toBe(StatusEffect.NONE);
    expect(enemyPokemon.getStatusEffect()).toBe(StatusEffect.NONE);
  });

  it("allows the user to poison a Poison or Steel type if the user reflects a status move that poisons", async () => {
    game.override.enemyMoveset(MoveId.MAGIC_COAT);
    await game.classicMode.startBattle([SpeciesId.MUK]);

    const playerPokemon = game.field.getPlayerPokemon();

    game.move.use(MoveId.TOXIC);
    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.toEndOfTurn();

    expect(playerPokemon.getStatusEffect()).toBe(StatusEffect.TOXIC);
  });
});
