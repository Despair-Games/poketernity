import { AbilityId } from "#enums/ability-id";
import { MoveId } from "#enums/move-id";
import { SpeciesId } from "#enums/species-id";
import { WeatherType } from "#enums/weather-type";
import { GameManager } from "#test/test-utils/gameManager";
import Phaser from "phaser";
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("Ability Attribute - Weather Heal", () => {
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
      .startingLevel(100)
      .moveset([MoveId.SPLASH])
      .ability(AbilityId.BALL_FETCH)
      .battleType("single")
      .disableCrits()
      .enemySpecies(SpeciesId.MAGIKARP)
      .enemyAbility(AbilityId.BALL_FETCH)
      .enemyMoveset(MoveId.SPLASH);
  });

  // prettier-ignore
  it.each([
    { ability: AbilityId.RAIN_DISH, abilityName: "Rain Dish", healRatio: 1/16, healStr: "1/16", weather: "Rain", weatherType: WeatherType.RAIN },
    { ability: AbilityId.RAIN_DISH, abilityName: "Rain Dish", healRatio: 1/16, healStr: "1/16", weather: "Heavy Rain", weatherType: WeatherType.HEAVY_RAIN },
    { ability: AbilityId.DRY_SKIN, abilityName: "Dry Skin", healRatio: 1/8, healStr: "1/8", weather: "Rain", weatherType: WeatherType.RAIN },
    { ability: AbilityId.DRY_SKIN, abilityName: "Dry Skin", healRatio: 1/8, healStr: "1/8", weather: "Heavy Rain", weatherType: WeatherType.HEAVY_RAIN },
    { ability: AbilityId.ICE_BODY, abilityName: "Ice Body", healRatio: 1/16, healStr: "1/16", weather: "Snow", weatherType: WeatherType.SNOW },
    { ability: AbilityId.ICE_BODY, abilityName: "Ice Body", healRatio: 1/16, healStr: "1/16", weather: "Hail", weatherType: WeatherType.HAIL },
    { ability: AbilityId.ICE_BODY, abilityName: "Ice Body", healRatio: 0, healStr: "0", weather: "Rain", weatherType: WeatherType.RAIN },
  ])("should make $abilityName restore $healStr of the user's HP in $weather", async ({ ability, healRatio, weatherType }) => {
    game.override.ability(ability).weather(weatherType);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    const expectedHeal = Math.floor(playerPokemon.hp * healRatio);
    playerPokemon.hp = 1;

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(playerPokemon.hp).toBe(expectedHeal + 1);
  });

  it("should not activate if Cloud Nine is active", async () => {
    game.override.ability(AbilityId.RAIN_DISH).weather(WeatherType.RAIN).enemyAbility(AbilityId.CLOUD_NINE);
    await game.classicMode.startBattle([SpeciesId.FEEBAS]);
    const playerPokemon = game.scene.getPlayerPokemon()!;
    playerPokemon.hp = 1;

    game.move.select(MoveId.SPLASH);
    await game.toEndOfTurn();

    expect(playerPokemon.hp).toBe(1);
  });

  // Interaction with Heal Block already tested in the Heal Block tests
});
