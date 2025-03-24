import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Primal Weather", () => {
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
      .ability(AbilityId.BALL_FETCH)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyMoveset(MoveId.SPLASH);
  });

  it.each([
    { weatherName: "Harsh Sun", ability: AbilityId.DESOLATE_LAND, weatherType: WeatherType.HARSH_SUN },
    { weatherName: "Heavy Rain", ability: AbilityId.PRIMORDIAL_SEA, weatherType: WeatherType.HEAVY_RAIN },
    { weatherName: "Strong Winds", ability: AbilityId.DELTA_STREAM, weatherType: WeatherType.STRONG_WINDS },
  ])("$weatherName can't be overwritten by non-primal weather", async ({ ability, weatherType }) => {
    game.override.ability(ability);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    game.move.use(MoveId.SANDSTORM);
    await game.toEndOfTurn();

    expect(game.scene.arena.hasWeather(weatherType)).toBe(true);
  });
});
