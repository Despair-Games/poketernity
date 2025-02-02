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

  it.each([
    { weatherName: "Sandstorm", weather: WeatherType.SANDSTORM },
    { weatherName: "Hail", weather: WeatherType.HAIL },
  ])("Overcoat should prevent damage from $weatherName", async ({ weather }) => {
    game.override.weather(weather).ability(Abilities.OVERCOAT);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    const playerPokemon = game.scene.getPlayerPokemon()!;
    expect(playerPokemon.isFullHp()).toBe(true);
  });

  it.each([
    { abilityName: "Sand Rush", ability: Abilities.SAND_RUSH },
    { abilityName: "Sand Veil", ability: Abilities.SAND_VEIL },
    { abilityName: "Sand Force", ability: Abilities.SAND_FORCE },
  ])("$abilityName should prevent sandstorm damage", async ({ ability }) => {
    game.override.weather(WeatherType.SANDSTORM).ability(ability);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    const playerPokemon = game.scene.getPlayerPokemon()!;
    expect(playerPokemon.isFullHp()).toBe(true);
  });

  it.each([
    { abilityName: "Ice Body", ability: Abilities.ICE_BODY },
    { abilityName: "Snow Cloak", ability: Abilities.SNOW_CLOAK },
  ])("$abilityName should prevent hail damage", async ({ ability }) => {
    game.override.weather(WeatherType.HAIL).ability(ability);
    await game.classicMode.startBattle([Species.FEEBAS]);

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    const playerPokemon = game.scene.getPlayerPokemon()!;
    expect(playerPokemon.isFullHp()).toBe(true);
  });
});
