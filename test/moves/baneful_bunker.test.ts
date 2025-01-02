import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";
import { GameManager } from "#test/testUtils/gameManager";
import { Species } from "#enums/species";
import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { BattlerIndex } from "#app/battle";
import { StatusEffect } from "#enums/status-effect";

describe("Moves - Baneful Bunker", () => {
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

    game.overridesHelper.battleType("single");

    game.overridesHelper.moveset(Moves.SLASH);

    game.overridesHelper.enemySpecies(Species.SNORLAX);
    game.overridesHelper.enemyAbility(Abilities.INSOMNIA);
    game.overridesHelper.enemyMoveset(Moves.BANEFUL_BUNKER);

    game.overridesHelper.startingLevel(100);
    game.overridesHelper.enemyLevel(100);
  });
  test("should protect the user and poison attackers that make contact", async () => {
    await game.classicModeHelper.startBattle([Species.CHARIZARD]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.SLASH);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("BerryPhase", false);
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
    expect(leadPokemon.status?.effect === StatusEffect.POISON).toBeTruthy();
  });
  test("should protect the user and poison attackers that make contact, regardless of accuracy checks", async () => {
    await game.classicModeHelper.startBattle([Species.CHARIZARD]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.SLASH);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    await game.moveHelper.forceMiss();
    await game.phaseInterceptor.to("BerryPhase", false);
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
    expect(leadPokemon.status?.effect === StatusEffect.POISON).toBeTruthy();
  });

  test("should not poison attackers that don't make contact", async () => {
    game.overridesHelper.moveset(Moves.FLASH_CANNON);
    await game.classicModeHelper.startBattle([Species.CHARIZARD]);

    const leadPokemon = game.scene.getPlayerPokemon()!;
    const enemyPokemon = game.scene.getEnemyPokemon()!;

    game.moveHelper.select(Moves.FLASH_CANNON);
    await game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    await game.phaseInterceptor.to("MoveEffectPhase");

    await game.moveHelper.forceMiss();
    await game.phaseInterceptor.to("BerryPhase", false);
    expect(enemyPokemon.hp).toBe(enemyPokemon.getMaxHp());
    expect(leadPokemon.status?.effect === StatusEffect.POISON).toBeFalsy();
  });
});
