import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Slush Rush", () => {
  // Note: The speed doubling properties of Slush Rush are tested in weather_based_speed_doubler.test.ts
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
      .weather(WeatherType.HAIL)
      .moveset([MoveId.SPLASH])
      .ability(AbilityId.SLUSH_RUSH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it("should not block damage from hail", async () => {
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const pokemon = game.scene.getPlayerPokemon();

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(pokemon?.isFullHp()).toBe(false);
  });
});
