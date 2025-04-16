import { AbilityId } from "#enums/ability-id";
import { ElementalType } from "#enums/elemental-type";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { GameManager } from "#test/test-utils/gameManager";
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
    await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

    const enemyPokemon = game.field.getEnemyPokemon();
    vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

    game.move.select(MoveId.EMBER);
    await game.toEndOfTurn();

    expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(2.0);
  });

  describe("Terastallized", () => {
    it("should increase STAB to 2.0 if tera type is NOT one of the user's original types", async () => {
      game.override.startingHeldItems([{ name: "TERA_SHARD", type: ElementalType.WATER }]);

      await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

      const playerPokemon = game.field.getPlayerPokemon();

      expect(playerPokemon.isTerastallized()).toBe(true);
      expect(playerPokemon.getTeraType()).toBe(ElementalType.WATER);

      const enemyPokemon = game.field.getEnemyPokemon();
      vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

      game.move.select(MoveId.WATER_GUN);
      await game.toEndOfTurn();

      expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(2.0);
    });

    it("should increase STAB to 2.25 if tera type matches one of the user's original types", async () => {
      game.override.startingHeldItems([{ name: "TERA_SHARD", type: ElementalType.FIRE }]);

      await game.classicMode.startBattle([SpeciesId.CHARMANDER]);

      const playerPokemon = game.field.getPlayerPokemon();

      expect(playerPokemon.isTerastallized()).toBe(true);
      expect(playerPokemon.getTeraType()).toBe(ElementalType.FIRE);

      const enemyPokemon = game.field.getEnemyPokemon();
      vi.spyOn(enemyPokemon, "calcStabMultiplierForTakingDamage");

      game.move.select(MoveId.EMBER);
      await game.toEndOfTurn();

      expect(enemyPokemon.calcStabMultiplierForTakingDamage).toHaveReturnedWith(2.25);
    });
  });
});
