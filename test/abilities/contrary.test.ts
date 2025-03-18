import { MoveId } from "#enums/move-id";
import { Abilities } from "#enums/abilities";
import { Species } from "#enums/species";
import { Stat } from "#enums/stat";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Contrary", () => {
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
      .enemySpecies(Species.BULBASAUR)
      .enemyAbility(Abilities.CONTRARY)
      .ability(Abilities.INTIMIDATE)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should invert stat changes when applied", async () => {
    await game.classicMode.startBattle([Species.SLOWBRO]);

    const enemyPokemon = game.scene.getEnemyPokemon()!;

    expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(1);
  }, 20000);

  describe("With Clear Body", () => {
    it("should apply positive effects", async () => {
      game.override.enemyPassiveAbility(Abilities.CLEAR_BODY).moveset([MoveId.TAIL_WHIP]);
      await game.classicMode.startBattle([Species.SLOWBRO]);

      const enemyPokemon = game.scene.getEnemyPokemon()!;

      expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(1);

      game.move.select(MoveId.TAIL_WHIP);
      await game.toEndOfTurn();

      expect(enemyPokemon.getStatStage(Stat.DEF)).toBe(1);
    });

    it("should block negative effects", async () => {
      game.override
        .enemyPassiveAbility(Abilities.CLEAR_BODY)
        .moveset(MoveId.SWAGGER)
        .passiveAbility(Abilities.NO_GUARD);
      await game.classicMode.startBattle([Species.SLOWBRO]);

      const enemyPokemon = game.scene.getEnemyPokemon()!;

      expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(1);

      game.move.select(MoveId.SWAGGER);
      await game.toEndOfTurn();

      expect(enemyPokemon.getStatStage(Stat.ATK)).toBe(1);
    });
  });
});
