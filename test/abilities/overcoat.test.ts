import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Overcoat", () => {
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
      .moveset([MoveId.SPLASH])
      .ability(Abilities.OVERCOAT)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it.each([
    { weatherName: "Sandstorm", weather: WeatherType.SANDSTORM },
    { weatherName: "Hail", weather: WeatherType.HAIL },
  ])("should prevent damage from $weatherName", async ({ weather }) => {
    game.override.weather(weather);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    const playerPokemon = game.scene.getPlayerPokemon()!;
    expect(playerPokemon.isFullHp()).toBe(true);
  });
});
