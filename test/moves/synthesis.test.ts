import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/testUtils/gameManager";
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
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
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

    await game.classicMode.startBattle([Species.FEEBAS]);

    const player = game.scene.getPlayerPokemon()!;
    vi.spyOn(player, "getMaxHp").mockReturnValue(100);
    player.hp = 1;

    game.move.select(MoveId.SYNTHESIS);

    await game.phaseInterceptor.to("BerryPhase", false);

    expect(player.hp).toBe(expRatio + 1);
  });
});
