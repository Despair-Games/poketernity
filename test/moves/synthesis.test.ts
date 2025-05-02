import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

describe("Moves - Synthesis", () => {
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
      .moveset([MoveId.SYNTHESIS])
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH)
      .startingLevel(100)
      .enemyLevel(100);
  });

  it.each([
    { weather: WeatherType.NONE, weatherName: "clear", expRatio: 50 },
    { weather: WeatherType.SUNNY, weatherName: "sunny", expRatio: 66 },
    { weather: WeatherType.RAIN, weatherName: "rainy", expRatio: 25 },
  ])("should restore $expRatio percent of the user's HP in $weatherName weather", async ({ weather, expRatio }) => {
    game.override.weather(weather);

    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;
    vi.spyOn(player, "getMaxHp").mockReturnValue(100);
    player.hp = 1;

    game.move.select(MoveId.SYNTHESIS);

    await game.toEndOfTurn();

    expect(player.hp).toBe(expRatio + 1);
  });
});
