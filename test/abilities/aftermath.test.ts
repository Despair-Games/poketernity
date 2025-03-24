import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { StatusEffect } from "#enums/status-effect";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Aftermath", () => {
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
      .ability(AbilityId.NO_GUARD)
      .startingLevel(50)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.AFTERMATH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should cause the attacker to take damage equal to 25% of their max HP when fainted by a contact move", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.move.use(MoveId.GRASS_KNOT);
    await game.toEndOfTurn();

    expect(player.hp).toBe(Math.ceil((player.getMaxHp() * 3) / 4));
  });

  it("should not cause the attacker to take damage when fainted by a non-contact move", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.move.use(MoveId.EARTHQUAKE);
    await game.toEndOfTurn();

    expect(player.isFullHp()).toBe(true);
  });

  it("should not cause the attacker to take damage if the attacker has Long Reach", async () => {
    game.override.ability(AbilityId.LONG_REACH);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;

    game.move.use(MoveId.WATERFALL);
    await game.toEndOfTurn();

    expect(player.isFullHp()).toBe(true);
  });

  it("should not cause any Pokemon other than the attacker to take damage", async () => {
    game.override.battleType("double");
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MILOTIC]);

    const [feebas, milotic] = game.scene.getPlayerParty();
    const enemy1 = game.field.getEnemyPokemon();

    game.move.use(MoveId.SPLASH, 0);
    game.move.use(MoveId.TACKLE, 1, BattlerIndex.ENEMY_2);
    await game.toEndOfTurn();

    expect(milotic.hp).toBe(Math.ceil((milotic.getMaxHp() * 3) / 4));
    expect(feebas.isFullHp()).toBe(true);
    expect(enemy1.isFullHp()).toBe(true);
  });

  it("should cause the attacker to take damage if the user faints to U-Turn", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MILOTIC]);

    const [feebas, milotic] = game.scene.getPlayerParty();

    game.move.use(MoveId.U_TURN);
    game.doSelectPartyPokemon(1);
    await game.toEndOfTurn();

    expect(feebas.isOnField()).toBe(false);
    expect(feebas.hp).toBe(Math.ceil((feebas.getMaxHp() * 3) / 4));
    expect(milotic.isOnField()).toBe(true);
    expect(milotic.isFullHp()).toBe(true);
  });

  it("should not allow the opponent to revive using a Reviver Seed", async () => {
    game.override.startingHeldItems([{ name: "REVIVER_SEED" }]);
    await game.classicMode.startBattle([SpeciesId.FEEBAS, SpeciesId.MILOTIC]);

    const [feebas, milotic] = game.scene.getPlayerParty();
    feebas.hp = 1;

    game.move.use(MoveId.GRASS_KNOT);
    game.doSelectPartyPokemon(1);
    await game.toEndOfTurn();

    expect(feebas.getHeldItems()[0]?.type.id).toBe("REVIVER_SEED");
    expect(feebas.isFainted()).toBe(true);
    expect(milotic.isFullHp()).toBe(true);
  });

  it("should not activate if the user faints by using Self-Destruct", async () => {
    await game.classicMode.startBattle([SpeciesId.GASTLY]); // Ghost-type, immune to Self-Destruct

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.FALSE_SWIPE);
    await game.move.forceEnemyMove(MoveId.SELF_DESTRUCT);
    await game.toEndOfTurn();

    expect(player.isFullHp()).toBe(true);
    expect(enemy.isFainted()).toBe(true);
  });

  it("should not activate if the user faints via indirect damage", async () => {
    game.override.enemyStatusEffect(StatusEffect.BURN);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.field.getPlayerPokemon();
    const enemy = game.field.getEnemyPokemon();

    game.move.use(MoveId.FALSE_SWIPE);
    await game.move.forceEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(player.isFullHp()).toBe(true);
    expect(enemy.isFainted()).toBe(true);
  });
});
