import { AbilityId } from "#enums/ability-id";
import { BattlerIndex } from "#enums/battler-index";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/game-manager";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Abilities - Adaptability", () => {
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
      .startingLevel(1)
      .moveset([MoveId.EMBER, MoveId.WATER_GUN])
      .ability(AbilityId.ADAPTABILITY)
      .enemySpecies(SpeciesId.MUNCHLAX)
      .disableCrits();
  });

  it("should increase STAB to 2.0 if move type matches one of the user's types", async () => {
    await game.classicMode.startBattle(SpeciesId.CHARMANDER);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.select(MoveId.EMBER);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(2.0);
  });

  it("should increase STAB to 2.0 if move type changes to a type that matches one of the user's types", async () => {
    await game.classicMode.startBattle(SpeciesId.TYNAMO);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.setTurnOrder([BattlerIndex.ENEMY, BattlerIndex.PLAYER]);
    game.move.select(MoveId.EMBER);
    await game.move.forceEnemyMove(MoveId.ELECTRIFY);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(2.0);
  });

  it("should not apply STAB if move type does not match one of the user's types", async () => {
    await game.classicMode.startBattle(SpeciesId.CHARMANDER);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.select(MoveId.WATER_GUN);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.0);
  });

  it("should not apply STAB to Struggle", async () => {
    await game.classicMode.startBattle(SpeciesId.RATTATA);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.use(MoveId.STRUGGLE);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.0);
  });

  describe("Terastallized", () => {
    it("should keep STAB at 1.5 if move type, but not tera type, is one of the user's original types", async () => {
      await game.classicMode.startBattle(SpeciesId.CHARMANDER);

      const playerPokemon = game.field.getPlayerPokemon();
      game.field.forceTera(playerPokemon, ElementalType.WATER);

      const enemyPokemon = game.field.getEnemyPokemon();
      vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

      game.move.select(MoveId.EMBER);
      await game.toEndOfTurn();

      expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.5);
    });

    it("should increase STAB to 2.0 if tera type is NOT one of the user's original types", async () => {
      await game.classicMode.startBattle(SpeciesId.CHARMANDER);

      const playerPokemon = game.field.getPlayerPokemon();
      game.field.forceTera(playerPokemon, ElementalType.WATER);

      const enemyPokemon = game.field.getEnemyPokemon();
      vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

      game.move.select(MoveId.WATER_GUN);
      await game.toEndOfTurn();

      expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(2.0);
    });

    it("should increase STAB to 2.25 if tera type matches one of the user's original types", async () => {
      await game.classicMode.startBattle(SpeciesId.CHARMANDER);

      const playerPokemon = game.field.getPlayerPokemon();
      game.field.forceTera(playerPokemon, ElementalType.FIRE);

      const enemyPokemon = game.field.getEnemyPokemon();
      vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

      game.move.select(MoveId.EMBER);
      await game.toEndOfTurn();

      expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(2.25);
    });

    it("should not apply STAB if move type does NOT match tera type or the user's original types", async () => {
      await game.classicMode.startBattle(SpeciesId.CHARMANDER);

      const playerPokemon = game.field.getPlayerPokemon();
      game.field.forceTera(playerPokemon, ElementalType.FIRE);

      const enemyPokemon = game.field.getEnemyPokemon();
      vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

      game.move.select(MoveId.WATER_GUN);
      await game.toEndOfTurn();

      expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.0);
    });

    it("should not apply to Stellar moves even if user is Stellar tera type", async () => {
      await game.classicMode.startBattle(SpeciesId.CHARMANDER);

      const playerPokemon = game.field.getPlayerPokemon();
      game.field.forceTera(playerPokemon, ElementalType.STELLAR);

      const enemyPokemon = game.field.getEnemyPokemon();
      vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

      game.move.use(MoveId.TERA_BLAST);
      await game.toEndOfTurn();

      expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(1.2);
    });
  });
});
