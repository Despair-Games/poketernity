import { Abilities } from "#enums/abilities";
import { MoveId } from "#enums/move-id";
import { Species } from "#enums/species";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/testUtils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Abilities - Post Weather Lapse Heal", () => {
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
      .ability(Abilities.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(Species.MAGIKARP)
      .enemyAbility(Abilities.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  it.each([
    { weather: "Rain", weatherType: WeatherType.RAIN },
    { weather: "Heavy Rain", weatherType: WeatherType.HEAVY_RAIN },
  ])("Rain Dish should restore 1/16 of the ability holder's HP in $weather", async ({ weatherType }) => {
    game.override.ability(Abilities.RAIN_DISH).weather(weatherType);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    const expectedHeal = Math.floor((playerPokemon.hp * 1) / 16);
    playerPokemon.hp = 1;

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon.hp).toBe(expectedHeal + 1);
  });

  it.each([
    { weather: "Rain", weatherType: WeatherType.RAIN },
    { weather: "Heavy Rain", weatherType: WeatherType.HEAVY_RAIN },
  ])("Dry Skin should restore 1/8 of the ability holder's HP in $weather", async ({ weatherType }) => {
    game.override.ability(Abilities.DRY_SKIN).weather(weatherType);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    const expectedHeal = Math.floor((playerPokemon.hp * 1) / 8);
    playerPokemon.hp = 1;

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon.hp).toBe(expectedHeal + 1);
  });

  it.each([
    { weather: "Hail", weatherType: WeatherType.HAIL },
    { weather: "Snow", weatherType: WeatherType.SNOW },
  ])("Ice Body should restore 1/16 of the ability holder's HP in $weather", async ({ weatherType }) => {
    game.override.ability(Abilities.ICE_BODY).weather(weatherType);
    await game.classicMode.startBattle([Species.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    const expectedHeal = Math.floor((playerPokemon.hp * 1) / 16);
    playerPokemon.hp = 1;

    game.move.select(MoveId.SPLASH);
    await game.phaseInterceptor.to("BerryPhase");

    expect(playerPokemon.hp).toBe(expectedHeal + 1);
  });
});
