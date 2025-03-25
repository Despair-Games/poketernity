import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/gameManager";
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
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  // prettier-ignore
  it.each([
    { ability: AbilityId.OVERCOAT, abilityName: "Overcoat", weatherName: "Sandstorm", weather: WeatherType.SANDSTORM },
    { ability: AbilityId.OVERCOAT, abilityName: "Overcoat", weatherName: "Hail", weather: WeatherType.HAIL },
    { ability: AbilityId.SAND_RUSH, abilityName: "Sand Rush", weatherName: "Sandstorm", weather: WeatherType.SANDSTORM },
    { ability: AbilityId.SAND_VEIL, abilityName: "Sand Veil", weatherName: "Sandstorm", weather: WeatherType.SANDSTORM },
    { ability: AbilityId.SAND_FORCE, abilityName: "Sand Force", weatherName: "Sandstorm", weather: WeatherType.SANDSTORM },
    { ability: AbilityId.ICE_BODY, abilityName: "Ice Body", weatherName: "Hail", weather: WeatherType.HAIL },
    { ability: AbilityId.SNOW_CLOAK, abilityName: "Snow Cloak", weatherName: "Hail", weather: WeatherType.HAIL },
  ])("$abilityName should prevent damage from $weatherName", async ({ ability, weather }) => {
    game.override.weather(weather).ability(ability);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    const playerPokemon = game.scene.getPlayerPokemon()!;
    expect(playerPokemon.isFullHp()).toBe(true);
  });
});
