import { Abilities } from "#enums/abilities";
import { Moves } from "#enums/moves";
import { Species } from "#enums/species";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Floral Healing", () => {
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
      .moveset([Moves.FLORAL_HEALING])
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(Moves.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it("should heal the target by half of their maximum HP", async () => {
    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMaxHp").mockReturnValue(100);
    enemy.hp = 1;

    game.move.select(Moves.FLORAL_HEALING);
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemy.hp).toBe(51);
  });

  it("should heal the target by 2/3 of their maximum HP under Grassy Terrain", async () => {
    game.override.enemyAbility(Abilities.GRASSY_SURGE);

    await game.classicMode.startBattle([Species.FEEBAS]);

    const enemy = game.scene.getEnemyPokemon()!;
    vi.spyOn(enemy, "getMaxHp").mockReturnValue(100);
    enemy.hp = 1;

    game.move.select(Moves.FLORAL_HEALING);
    await game.phaseInterceptor.to("BerryPhase", false);

    expect(enemy.hp).toBe(67);
  });
});
