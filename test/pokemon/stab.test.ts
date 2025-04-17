import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("STAB", () => {
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
      .disableCrits()
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should have a NO STAB (1.0) on type mismatch", async () => {
    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.use(MoveId.WATER_GUN);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.0);
  });

  it("should have a STAB of 1.5 on type match", async () => {
    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.use(MoveId.EMBER);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.5);
  });

  it("should have a 1.5 STAB on tera type not matching default type", async () => {
    game.override.startingHeldItems([{ name: "TERA_SHARD", type: ElementalType.WATER }]);

    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const playerPokemon = game.field.getPlayerPokemon();
    expect(playerPokemon.isTerastallized()).toBe(true);
    expect(playerPokemon.getTeraType()).toBe(ElementalType.WATER);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.use(MoveId.WATER_GUN);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.5);
  });

  it("should have a 2.0 STAB on tera type MATCHING default type", async () => {
    game.override.startingHeldItems([{ name: "TERA_SHARD", type: ElementalType.FIRE }]);

    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const playerPokemon = game.field.getPlayerPokemon();
    expect(playerPokemon.isTerastallized()).toBe(true);
    expect(playerPokemon.getTeraType()).toBe(ElementalType.FIRE);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.use(MoveId.EMBER);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(2.0);
  });

  it("should have a 1.5 STAB on Stellar tera- & move-type", async () => {
    game.override.startingHeldItems([{ name: "TERA_SHARD", type: ElementalType.STELLAR }]);

    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const playerPokemon = game.field.getPlayerPokemon();
    expect(playerPokemon.isTerastallized()).toBe(true);
    expect(playerPokemon.getTeraType()).toBe(ElementalType.STELLAR);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.use(MoveId.TERA_BLAST);
    await game.move.selectEnemyMove(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.5);
  });

  it.todo("should have a 1.5 STAB on pledge moves");

  it.todo("should have a 2.0 STAB on pledge moves if tera type DOES NOT match default type");

  it.todo("should have a 2.25 STAB on pledge moves if tera type does match default type");
});
