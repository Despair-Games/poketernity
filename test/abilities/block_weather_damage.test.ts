import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Ability Attribute - Block Weather Damage", () => {
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
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  // prettier-ignore
  it.each([
    { ability: Abilities.OVERCOAT, abilityName: "Overcoat", weatherName: "Sandstorm", weather: WeatherType.SANDSTORM },
    { ability: Abilities.OVERCOAT, abilityName: "Overcoat", weatherName: "Hail", weather: WeatherType.HAIL },
    { ability: Abilities.SAND_RUSH, abilityName: "Sand Rush", weatherName: "Sandstorm", weather: WeatherType.SANDSTORM },
    { ability: Abilities.SAND_VEIL, abilityName: "Sand Veil", weatherName: "Sandstorm", weather: WeatherType.SANDSTORM },
    { ability: Abilities.SAND_FORCE, abilityName: "Sand Force", weatherName: "Sandstorm", weather: WeatherType.SANDSTORM },
    { ability: Abilities.ICE_BODY, abilityName: "Ice Body", weatherName: "Hail", weather: WeatherType.HAIL },
    { ability: Abilities.SNOW_CLOAK, abilityName: "Snow Cloak", weatherName: "Hail", weather: WeatherType.HAIL },
  ])("$abilityName should prevent damage from $weatherName", async ({ ability, weather }) => {
    game.override.weather(weather).ability(ability);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    const playerPokemon = game.scene.getPlayerPokemon()!;
    expect(playerPokemon.isFullHp()).toBe(true);
  });
});
